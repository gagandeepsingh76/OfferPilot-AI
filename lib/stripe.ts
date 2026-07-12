import Stripe from "stripe"

export const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return null

  return new Stripe(secretKey, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2024-06-20" as any,
    typescript: true,
  })
}
