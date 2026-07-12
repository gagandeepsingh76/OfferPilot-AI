import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is missing. Please set it in your environment variables.")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2024-06-20" as any,
  typescript: true,
})
