"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession, createCustomerPortalSession } from "@/server/actions/stripe"
import { Loader2, Zap } from "lucide-react"
import { toast } from "sonner"

interface BillingFormProps {
  isPro: boolean
  isStripeConfigured: boolean
  isDemo?: boolean
}

export function BillingForm({ isPro, isStripeConfigured, isDemo }: BillingFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async () => {
    if (isDemo) {
      toast.info("The demo account already has Pro access. Use a real account to test Stripe checkout.")
      return
    }

    if (!isStripeConfigured) {
      toast.error("Stripe is not configured in this environment.")
      return
    }

    try {
      setIsLoading(true)
      const action = isPro ? createCustomerPortalSession : createCheckoutSession
      const result = await action()

      if (result.success && result.url) {
        window.location.href = result.url
      } else {
        toast.error(result.error || "Billing is unavailable right now.")
      }
    } catch {
      toast.error("Billing is unavailable right now.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border border-border rounded-xl p-8 bg-card max-w-2xl mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-full">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h4 className="text-2xl font-bold tracking-tight">
            {isPro ? "Pro Plan" : "Starter Plan"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isPro
              ? "You are currently on the Pro plan."
              : "Upgrade to Pro to unlock advanced AI features."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {!isPro && (
          <ul className="text-sm text-muted-foreground space-y-2 mb-6">
            <li>Unlimited AI offer parsing</li>
            <li>Advanced negotiation coaching</li>
            <li>Unlimited offer comparisons</li>
          </ul>
        )}

        <Button
          onClick={handleAction}
          disabled={isLoading || !isStripeConfigured || isDemo}
          className="w-full sm:w-auto"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPro ? "Manage Subscription" : "Upgrade to Pro"}
        </Button>

        {!isStripeConfigured && (
          <p className="text-xs text-destructive mt-2">
            Billing is currently unavailable. Stripe keys are not configured.
          </p>
        )}
        {isDemo && (
          <p className="text-xs text-muted-foreground mt-2">
            Demo mode includes Pro access and does not open Stripe Checkout.
          </p>
        )}
      </div>
    </div>
  )
}
