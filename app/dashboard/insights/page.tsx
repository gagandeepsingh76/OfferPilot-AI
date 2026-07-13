import Link from "next/link"
import { Lightbulb, MessageSquare, ShieldCheck, Sparkles } from "lucide-react"
import { getOffersForCurrentUser } from "@/lib/offers-data"
import { buttonVariants } from "@/components/ui/button"

export default async function InsightsPage() {
  const { offers, error } = await getOffersForCurrentUser()
  const pendingOffers = offers.filter((offer) => offer.status === "PENDING")
  const offersWithEquity = pendingOffers.filter((offer) => (offer.compensation?.equity || 0) > 0)
  const offersWithoutBonus = pendingOffers.filter((offer) => !offer.compensation?.bonus)
  const nextOffer = pendingOffers[0]

  const insights = [
    {
      title: "Clarify equity refreshers",
      description: offersWithEquity.length
        ? `${offersWithEquity.length} pending offer${offersWithEquity.length === 1 ? "" : "s"} include equity. Ask about refresher cadence, vesting cliffs, and what happens after year four.`
        : "No pending offers include equity yet. When one does, verify vesting, refreshers, and liquidity before comparing totals.",
      icon: Sparkles,
    },
    {
      title: "Use cash certainty as leverage",
      description: offersWithoutBonus.length
        ? `${offersWithoutBonus.length} pending offer${offersWithoutBonus.length === 1 ? "" : "s"} list no annual bonus. That can be a clean opening to negotiate sign-on or base salary.`
        : "Your pending offers include bonus data. Compare target bonus certainty before treating it as guaranteed compensation.",
      icon: Lightbulb,
    },
    {
      title: "Keep negotiation asks narrow",
      description: "Lead with one primary ask and one backup ask. Recruiters respond better to a focused compensation case than a long list of unrelated improvements.",
      icon: MessageSquare,
    },
    {
      title: "Protect decision quality",
      description: "Before accepting, check expiration dates, relocation clawbacks, equity documents, non-competes, and severance language.",
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="mt-1 text-muted-foreground">Actionable guidance generated from your current offer pipeline.</p>
        </div>
        {nextOffer && (
          <Link href={`/dashboard/offers/${nextOffer.id}/chat`} className={buttonVariants({ className: "gap-2" })}>
            <MessageSquare className="h-4 w-4" /> Coach Me
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <div key={insight.title} className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <insight.icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">{insight.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Decision Checklist</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Compare first-year cash separately from four-year equity.",
            "Ask whether equity refreshers are performance-based or standardized.",
            "Confirm remote, relocation, and office expectations in writing.",
            "Save recruiter replies and offer PDFs on the offer detail page.",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
