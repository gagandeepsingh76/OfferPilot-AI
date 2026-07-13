import Link from "next/link"
import { BarChart3, Briefcase, DollarSign, TrendingUp } from "lucide-react"
import { getOffersForCurrentUser } from "@/lib/offers-data"
import { buttonVariants } from "@/components/ui/button"

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function AnalyticsPage() {
  const { offers, error } = await getOffersForCurrentUser()
  const totals = offers.map((offer) => {
    const compensation = offer.compensation
    return {
      id: offer.id,
      companyName: offer.companyName,
      total:
        (compensation?.baseSalary || 0) +
        (compensation?.bonus || 0) +
        (compensation?.signOnBonus || 0) +
        (compensation?.equity || 0),
      base: compensation?.baseSalary || 0,
      currency: compensation?.currency || "USD",
    }
  })
  const highest = totals.reduce((best, item) => (item.total > best.total ? item : best), totals[0] || { total: 0, base: 0, currency: "USD", companyName: "None", id: "" })
  const pendingCount = offers.filter((offer) => offer.status === "PENDING").length
  const averageBase = offers.length ? totals.reduce((sum, item) => sum + item.base, 0) / offers.length : 0
  const maxTotal = Math.max(1, ...totals.map((item) => item.total))

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Compensation, pipeline, and decision signals across your offers.</p>
        </div>
        <Link href="/dashboard/offers/new" className={buttonVariants({ className: "gap-2" })}>
          <Briefcase className="h-4 w-4" /> Add Offer
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Tracked Offers</h2>
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-bold">{offers.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">{pendingCount} pending decisions</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Average Base</h2>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-bold">{formatCurrency(averageBase, highest.currency)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across active and archived offers</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Highest Package</h2>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-bold">{formatCurrency(highest.total, highest.currency)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{highest.companyName}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Total Compensation by Offer</h2>
            <p className="text-sm text-muted-foreground">Base, bonus, sign-on, and equity value combined.</p>
          </div>
        </div>
        <div className="space-y-4">
          {totals.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Add offers to see compensation analytics.
            </div>
          ) : (
            totals.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium">{item.companyName}</span>
                  <span className="text-muted-foreground">{formatCurrency(item.total, item.currency)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(6, (item.total / maxTotal) * 100)}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
