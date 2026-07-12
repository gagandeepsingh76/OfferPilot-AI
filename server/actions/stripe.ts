"use server"

import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || ""
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function createCheckoutSession() {
  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    
    if (!userData?.user) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = userData.user.id
    
    const dbUser = await prisma.user.findUnique({
      where: { authId: userId },
      include: { subscription: true }
    })

    if (!dbUser) {
      return { success: false, error: "User not found" }
    }

    if (!PRO_PRICE_ID) {
      return { success: false, error: "Stripe Price ID is not configured" }
    }

    // Check if user already has a subscription that is active
    if (dbUser.subscription?.plan === "PRO" && dbUser.subscription?.stripeCustomerId) {
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
      success_url: `${APP_URL}/dashboard/settings/billing?success=true`,
      cancel_url: `${APP_URL}/dashboard/settings/billing?canceled=true`,
      client_reference_id: dbUser.id,
      metadata: {
        userId: dbUser.id,
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
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    
    if (!userData?.user) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = userData.user.id
    
    const dbUser = await prisma.user.findUnique({
      where: { authId: userId },
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

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${APP_URL}/dashboard/settings/billing`,
    })

    return { success: true, url: portalSession.url }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to create customer portal session:", error)
    return { success: false, error: error.message || "Failed to create customer portal session" }
  }
}
