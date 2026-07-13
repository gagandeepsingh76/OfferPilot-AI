"use server"

import { getStripe, isStripeCheckoutConfigured } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { getCurrentAppUser } from "@/lib/current-user"
import { getAppUrl } from "@/lib/url"
import { isSubscriptionActive } from "@/lib/subscription"

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || ""

export async function createCheckoutSession() {
  try {
    const appUser = await getCurrentAppUser()
    
    if (!appUser) {
      return { success: false, error: "Please sign in to manage billing." }
    }

    if (appUser.isDemo) {
      return { success: false, error: "Demo mode includes Pro access. Use a real account to test checkout." }
    }

    if (!appUser.dbUserId) {
      return { success: false, error: "Your account is still being prepared. Please refresh and try again." }
    }
    
    const dbUser = await prisma.user.findUnique({
      where: { id: appUser.dbUserId },
      include: { subscription: true }
    })

    if (!dbUser) {
      return { success: false, error: "User not found" }
    }

    if (!isStripeCheckoutConfigured() || !PRO_PRICE_ID) {
      return { success: false, error: "Stripe Price ID is not configured" }
    }

    if (isSubscriptionActive(dbUser.subscription) && dbUser.subscription?.stripeCustomerId) {
      return { success: false, error: "You already have a Pro subscription" }
    }

    let stripeCustomerId = dbUser.subscription?.stripeCustomerId

    const stripe = getStripe()
    if (!stripe) {
      return { success: false, error: "Billing is currently unavailable. Please configure Stripe." }
    }

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        metadata: {
          userId: dbUser.id,
        }
      })
      stripeCustomerId = customer.id

      // Store the customer ID immediately
      await prisma.subscription.upsert({
        where: { userId: dbUser.id },
        update: { stripeCustomerId: stripeCustomerId },
        create: {
          userId: dbUser.id,
          stripeCustomerId: stripeCustomerId,
        }
      })
    }

    const appUrl = await getAppUrl()

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRO_PRICE_ID,
          quantity: 1,
        }
      ],
      success_url: `${appUrl}/dashboard/settings/billing?success=true`,
      cancel_url: `${appUrl}/dashboard/settings/billing?canceled=true`,
      client_reference_id: dbUser.id,
      metadata: {
        userId: dbUser.id,
      },
      subscription_data: {
        metadata: {
          userId: dbUser.id,
        },
      },
    })

    return { success: true, url: session.url }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to create checkout session:", error)
    return { success: false, error: error.message || "Failed to create checkout session" }
  }
}

export async function createCustomerPortalSession() {
  try {
    const appUser = await getCurrentAppUser()
    
    if (!appUser) {
      return { success: false, error: "Please sign in to manage billing." }
    }

    if (appUser.isDemo) {
      return { success: false, error: "Demo mode includes Pro access. Use a real account to test the customer portal." }
    }

    if (!appUser.dbUserId) {
      return { success: false, error: "Your account is still being prepared. Please refresh and try again." }
    }
    
    const dbUser = await prisma.user.findUnique({
      where: { id: appUser.dbUserId },
      include: { subscription: true }
    })

    const stripeCustomerId = dbUser?.subscription?.stripeCustomerId

    if (!stripeCustomerId) {
      return { success: false, error: "No active subscription found" }
    }

    const stripe = getStripe()
    if (!stripe) {
      return { success: false, error: "Billing is currently unavailable. Please configure Stripe." }
    }

    const appUrl = await getAppUrl()

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${appUrl}/dashboard/settings/billing`,
    })

    return { success: true, url: portalSession.url }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to create customer portal session:", error)
    return { success: false, error: error.message || "Failed to create customer portal session" }
  }
}
