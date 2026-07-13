import { ComparisonView } from "./comparison-view"
import { getOffersForCurrentUser } from "@/lib/offers-data"

export default async function ComparisonsPage() {
  const { offers, error } = await getOffersForCurrentUser()

  return (
    <div className="max-w-5xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compare Offers</h1>
        <p className="text-muted-foreground mt-1">Select multiple offers to generate an AI-powered comparison and recommendation.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <ComparisonView offers={offers} />
    </div>
  )
}
