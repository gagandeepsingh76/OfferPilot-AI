/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { getStripe, isStripeWebhookConfigured } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import {
  planFromStripeStatus,
  stripeCustomerIdFrom,
  stripeSubscriptionCancelAtPeriodEnd,
  stripeSubscriptionPeriodEnd,
  stripeSubscriptionPriceId,
} from "@/lib/subscription"

async function logSubscriptionAudit(userId: string, action: "SUBSCRIPTION_CREATED" | "SUBSCRIPTION_UPDATED" | "SUBSCRIPTION_CANCELED", details: Record<string, unknown>) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details as any,
      },
    })
  } catch (error) {
    console.error("Failed to write subscription audit log:", error)
  }
}

async function resolveSubscriptionUserId(subscription: Stripe.Subscription, fallbackUserId?: string | null) {
  if (fallbackUserId) return fallbackUserId
  if (subscription.metadata?.userId) return subscription.metadata.userId

  const existingBySubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })
  if (existingBySubscription) return existingBySubscription.userId

  const customerId = stripeCustomerIdFrom(subscription.customer)
  if (!customerId) return null

  const existingByCustomer = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  })

  return existingByCustomer?.userId ?? null
}

async function syncStripeSubscription(subscription: Stripe.Subscription, fallbackUserId?: string | null) {
  const userId = await resolveSubscriptionUserId(subscription, fallbackUserId)
  if (!userId) {
    throw new Error(`No user could be resolved for Stripe subscription ${subscription.id}`)
  }

  const customerId = stripeCustomerIdFrom(subscription.customer)
  if (!customerId) {
    throw new Error(`No customer could be resolved for Stripe subscription ${subscription.id}`)
  }

  const plan = planFromStripeStatus(subscription.status)

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: stripeSubscriptionPriceId(subscription),
      currentPeriodEnd: stripeSubscriptionPeriodEnd(subscription),
      cancelAtPeriodEnd: stripeSubscriptionCancelAtPeriodEnd(subscription),
    },
    create: {
      userId,
      plan,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: stripeSubscriptionPriceId(subscription),
      currentPeriodEnd: stripeSubscriptionPeriodEnd(subscription),
      cancelAtPeriodEnd: stripeSubscriptionCancelAtPeriodEnd(subscription),
    },
  })

  return { userId, plan }
}

async function cancelStripeSubscription(subscription: Stripe.Subscription) {
  const userId = await resolveSubscriptionUserId(subscription)
  if (!userId) {
    throw new Error(`No user could be resolved for deleted Stripe subscription ${subscription.id}`)
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      plan: "FREE",
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    },
  })

  return userId
}

export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 })
  }

  if (!isStripeWebhookConfigured()) {
    console.warn("STRIPE_WEBHOOK_SECRET is not set. Cannot verify webhook signature.")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 400 })
  }

  try {
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature")
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown signature error"
      console.error(`Webhook signature verification failed: ${message}`)
      return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== "subscription") break

        const subscriptionId = typeof session.subscription === "string" ? session.subscription : null
        if (!subscriptionId) {
          throw new Error(`Checkout session ${session.id} did not include a subscription ID`)
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = session.client_reference_id ?? session.metadata?.userId ?? subscription.metadata?.userId
        const synced = await syncStripeSubscription(subscription, userId)

        await logSubscriptionAudit(synced.userId, "SUBSCRIPTION_CREATED", {
          plan: synced.plan,
          subscriptionId,
          checkoutSessionId: session.id,
        })
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const synced = await syncStripeSubscription(subscription)

        await logSubscriptionAudit(synced.userId, "SUBSCRIPTION_UPDATED", {
          status: subscription.status,
          plan: synced.plan,
          cancelAtPeriodEnd: stripeSubscriptionCancelAtPeriodEnd(subscription),
          subscriptionId: subscription.id,
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = await cancelStripeSubscription(subscription)

        await logSubscriptionAudit(userId, "SUBSCRIPTION_CANCELED", {
          status: subscription.status,
          subscriptionId: subscription.id,
        })
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceWithSubscription = invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }
        const subscriptionId = typeof invoiceWithSubscription.subscription === "string"
          ? invoiceWithSubscription.subscription
          : invoiceWithSubscription.subscription?.id

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const synced = await syncStripeSubscription(subscription)
          await logSubscriptionAudit(synced.userId, "SUBSCRIPTION_UPDATED", {
            event: "invoice.payment_failed",
            status: subscription.status,
            plan: synced.plan,
            subscriptionId,
          })
        } else {
          const customerId = stripeCustomerIdFrom(invoice.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null)
          console.warn(`Payment failed for customer ${customerId ?? "unknown"}`)
        }
        break
      }

      default:
        console.log(`Ignored Stripe event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing failed:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
