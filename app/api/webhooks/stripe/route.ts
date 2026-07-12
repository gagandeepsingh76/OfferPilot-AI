/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string

    let event: Stripe.Event

    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is not set. Cannot verify webhook signature.")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 400 })
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
     
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session
    const subscription = event.data.object as Stripe.Subscription

    switch (event.type) {
      case "checkout.session.completed":
        if (session.mode === "subscription") {
          const userId = session.client_reference_id
          const customerId = session.customer as string
          const subscriptionId = session.subscription as string

          if (!userId) {
            console.error("No user ID found in checkout session")
            break
          }

          // Fetch the subscription details from Stripe to get the price and period end
          const subscriptionDetails = await stripe.subscriptions.retrieve(subscriptionId)

          await prisma.subscription.upsert({
            where: { userId },
            update: {
              plan: "PRO",
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: (subscriptionDetails as any).items.data[0].price.id,
              currentPeriodEnd: new Date((subscriptionDetails as any).current_period_end * 1000),
              cancelAtPeriodEnd: (subscriptionDetails as any).cancel_at_period_end,
            },
            create: {
              userId,
              plan: "PRO",
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: (subscriptionDetails as any).items.data[0].price.id,
              currentPeriodEnd: new Date((subscriptionDetails as any).current_period_end * 1000),
              cancelAtPeriodEnd: (subscriptionDetails as any).cancel_at_period_end,
            }
          })

          await prisma.auditLog.create({
            data: {
              userId,
              action: "SUBSCRIPTION_CREATED",
               
              details: { plan: "PRO", subscriptionId } as any
            }
          })
        }
        break

      case "customer.subscription.updated":
        {
          const customerId = subscription.customer as string
          
          const dbSub = await prisma.subscription.findUnique({
            where: { stripeCustomerId: customerId }
          })

          if (dbSub) {
            await prisma.subscription.update({
              where: { stripeCustomerId: customerId },
              data: {
                stripeSubscriptionId: subscription.id,
                stripePriceId: (subscription as any).items.data[0].price.id,
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
                plan: subscription.status === "active" || subscription.status === "trialing" ? "PRO" : "FREE"
              }
            })

            await prisma.auditLog.create({
              data: {
                userId: dbSub.userId,
                action: "SUBSCRIPTION_UPDATED",
                 
                details: { status: subscription.status, cancelAtPeriodEnd: (subscription as any).cancel_at_period_end } as any
              }
            })
          }
        }
        break

      case "customer.subscription.deleted":
        {
          const customerId = subscription.customer as string
          
          const dbSub = await prisma.subscription.findUnique({
            where: { stripeCustomerId: customerId }
          })

          if (dbSub) {
            await prisma.subscription.update({
              where: { stripeCustomerId: customerId },
              data: {
                plan: "FREE",
                stripeSubscriptionId: null,
                stripePriceId: null,
                currentPeriodEnd: null,
                cancelAtPeriodEnd: false
              }
            })

            await prisma.auditLog.create({
              data: {
                userId: dbSub.userId,
                action: "SUBSCRIPTION_CANCELED",
                 
                details: { reason: "deleted" } as any
              }
            })
          }
        }
        break

      case "invoice.payment_failed":
        {
          const invoice = event.data.object as Stripe.Invoice
          const customerId = invoice.customer as string
          console.warn(`Payment failed for customer ${customerId}`)
          
          const dbSub = await prisma.subscription.findUnique({
            where: { stripeCustomerId: customerId }
          })
          
          if (dbSub) {
            // Depending on business logic, we could downgrade immediately or let customer.subscription.deleted handle it
            // For now, just log it.
            await prisma.auditLog.create({
              data: {
                userId: dbSub.userId,
                action: "SUBSCRIPTION_UPDATED",
                 
                details: { event: "invoice.payment_failed" } as any
              }
            })
          }
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
   
  } catch (err: any) {
    console.error("Webhook processing failed:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
