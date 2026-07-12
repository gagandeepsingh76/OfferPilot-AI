"use client"

import * as React from "react"
import { Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { createCheckoutSession, createCustomerPortalSession } from "@/server/actions/stripe"

interface BillingClientProps {
  isPro: boolean
}

export function BillingClient({ isPro }: BillingClientProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleAction = async () => {
    setIsLoading(true)
    try {
      if (isPro) {
        const result = await createCustomerPortalSession()
        if (result.success && result.url) {
          window.location.href = result.url
        } else {
          toast.error(result.error || "Failed to open customer portal")
        }
      } else {
        const result = await createCheckoutSession()
        if (result.success && result.url) {
          window.location.href = result.url
        } else {
          toast.error(result.error || "Failed to start checkout")
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleAction}
      disabled={isLoading}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 mt-4 w-full sm:w-auto ${
        isPro 
          ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          : "bg-primary text-primary-foreground shadow hover:bg-primary/90"
      }`}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPro ? "Manage Billing" : "Upgrade to Pro"}
      {!isPro && !isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
    </button>
  )
}
