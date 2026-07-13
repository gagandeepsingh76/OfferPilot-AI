import type { PlanType, Subscription } from "@prisma/client"
import type Stripe from "stripe"

type SubscriptionLike = Pick<Subscription, "plan" | "currentPeriodEnd"> | null | undefined

const ENTITLED_STRIPE_STATUSES = new Set<Stripe.Subscription.Status>(["active", "trialing"])

export function isSubscriptionActive(subscription: SubscriptionLike, now = new Date()) {
  if (!subscription || subscription.plan !== "PRO") return false
  if (!subscription.currentPeriodEnd) return true

  return subscription.currentPeriodEnd > now
}

export function planFromStripeStatus(status: Stripe.Subscription.Status): PlanType {
  return ENTITLED_STRIPE_STATUSES.has(status) ? "PRO" : "FREE"
}

export function stripeCustomerIdFrom(value: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  if (!value) return null
  return typeof value === "string" ? value : value.id
}

export function stripeSubscriptionPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price.id ?? null
}

export function stripeSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const currentPeriodEnd = (subscription as unknown as { current_period_end?: unknown }).current_period_end
  return typeof currentPeriodEnd === "number" ? new Date(currentPeriodEnd * 1000) : null
}

export function stripeSubscriptionCancelAtPeriodEnd(subscription: Stripe.Subscription) {
  const cancelAtPeriodEnd = (subscription as unknown as { cancel_at_period_end?: unknown }).cancel_at_period_end
  return typeof cancelAtPeriodEnd === "boolean" ? cancelAtPeriodEnd : false
}
