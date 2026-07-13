import Stripe from "stripe"

function isConfiguredValue(value: string | undefined, prefix: string) {
  return Boolean(value && value.startsWith(prefix) && !value.includes("...") && !value.includes("your_"))
}

export function isStripeSecretConfigured() {
  return isConfiguredValue(process.env.STRIPE_SECRET_KEY, "sk_")
}

export function isStripePriceConfigured() {
  return isConfiguredValue(process.env.STRIPE_PRO_PRICE_ID, "price_")
}

export function isStripeWebhookConfigured() {
  return isConfiguredValue(process.env.STRIPE_WEBHOOK_SECRET, "whsec_")
}

export function isStripeCheckoutConfigured() {
  return isStripeSecretConfigured() && isStripePriceConfigured()
}

export const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!isStripeSecretConfigured() || !secretKey) return null

  return new Stripe(secretKey, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2024-06-20" as any,
    typescript: true,
  })
}
