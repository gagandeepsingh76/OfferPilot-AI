import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { getUsageStats } from "@/lib/ai-usage"
import { BillingClient } from "./billing-client"
import { redirect } from "next/navigation"

export default async function BillingSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const prismaUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { subscription: true }
  })

  if (!prismaUser) {
    redirect("/login")
  }

  const stats = await getUsageStats(prismaUser.id)
  const isPro = stats.isPro
  
  const subscription = prismaUser.subscription

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription, billing details, and view your usage.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-border rounded-xl p-6 bg-card flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-bold tracking-tight mb-2">
              {isPro ? "Pro Plan" : "Free Plan"}
            </h4>
            <p className="text-sm text-muted-foreground mb-6">
              {isPro 
                ? "You have unlimited access to all features." 
                : "You are currently on the Free plan with limited usage."}
            </p>
            {isPro && subscription?.currentPeriodEnd && (
              <p className="text-sm font-medium mb-2">
                Renewal Date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
            {isPro && subscription?.cancelAtPeriodEnd && (
              <p className="text-sm text-amber-500 font-medium mb-2">
                Your subscription will cancel at the end of the billing period.
              </p>
            )}
          </div>
          <BillingClient isPro={isPro} />
        </div>

        {!isPro && (
          <div className="border border-border rounded-xl p-6 bg-card space-y-6">
            <h4 className="font-semibold">Current Usage</h4>
            
            <UsageMeter 
              label="Saved Offers" 
              used={stats.offers} 
              limit={stats.limits.OFFERS} 
            />
            <UsageMeter 
              label="PDF Uploads" 
              used={stats.pdfs} 
              limit={stats.limits.PDF_UPLOAD} 
            />
            <UsageMeter 
              label="AI Analyses (Monthly)" 
              used={stats.aiAnalysis} 
              limit={stats.limits.AI_ANALYSIS} 
            />
            <UsageMeter 
              label="AI Chats (Monthly)" 
              used={stats.chatMessage} 
              limit={stats.limits.CHAT_MESSAGE} 
            />
            <UsageMeter 
              label="AI Comparisons (Monthly)" 
              used={stats.aiComparison} 
              limit={stats.limits.AI_COMPARISON} 
            />
          </div>
        )}
      </div>
    </div>
  )
}

function UsageMeter({ label, used, limit }: { label: string, used: number, limit: number }) {
  const percentage = Math.min((used / limit) * 100, 100)
  const isNearLimit = percentage >= 80

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-medium">{used} / {limit}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-amber-500' : 'bg-primary'}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
