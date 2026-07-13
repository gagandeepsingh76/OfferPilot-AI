import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { BillingForm } from "@/components/billing/billing-form"
import { getCurrentAppUser } from "@/lib/current-user"
import { isStripeCheckoutConfigured } from "@/lib/stripe"
import { isSubscriptionActive } from "@/lib/subscription"

export default async function BillingSettingsPage() {
  const user = await getCurrentAppUser()
  if (!user) {
    redirect("/login")
  }

  let prismaUser = null

  try {
    prismaUser = user.dbUserId
      ? await prisma.user.findUnique({
        where: { id: user.dbUserId },
        include: { subscription: true }
      })
      : null
  } catch (error) {
    console.error("Failed to load billing profile:", error)
  }

  const subscription = prismaUser?.subscription ?? null
  const isPro = user.isDemo || isSubscriptionActive(subscription)
  const isStripeConfigured = isStripeCheckoutConfigured()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      <BillingForm
        isPro={isPro}
        isStripeConfigured={isStripeConfigured}
        isDemo={user.isDemo}
        cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
        currentPeriodEnd={subscription?.currentPeriodEnd?.toISOString() ?? null}
      />
    </div>
  )
}
