import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

export default async function BillingSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const prismaUser = await prisma.user.findUnique({
    where: { authId: user.id },
  })

  if (!prismaUser) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="border border-border rounded-xl p-8 bg-card max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <h4 className="text-2xl font-bold tracking-tight">
            Premium Assessment Build
          </h4>
        </div>
        
        <div className="space-y-4">
          <p className="text-muted-foreground text-lg">
            This assessment build provides all features for evaluation purposes. No payment is required.
          </p>
          <p className="text-sm text-muted-foreground">
            You have unlimited access to AI Offer Parsing, AI Negotiation Coaching, and Side-by-Side Offer Comparisons. 
            The Stripe integration remains fully functional in the codebase for production readiness, but feature gating has been disabled for this review.
          </p>
        </div>
      </div>
    </div>
  )
}
