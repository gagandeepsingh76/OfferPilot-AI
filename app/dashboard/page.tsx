import Link from "next/link"
import { Plus, Briefcase, TrendingUp, Clock, Calculator } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { buttonVariants } from "@/components/ui/button"

async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const prismaUser = await prisma.user.findUnique({ where: { authId: user.id } })
  if (!prismaUser) return null

  const offers = await prisma.offer.findMany({
    where: { userId: prismaUser.id },
    include: { compensation: true },
    orderBy: { createdAt: "desc" },
  })

  let highestSalary = 0
  let pendingCount = 0

  offers.forEach(o => {
    if (o.status === "PENDING") pendingCount++
    if (o.compensation && o.compensation.baseSalary > highestSalary) {
      highestSalary = o.compensation.baseSalary
    }
  })

  return {
    offers,
    totalOffers: offers.length,
    pendingOffers: pendingCount,
    highestSalary,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  
  if (!data) return null // Handled by middleware mostly

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s a breakdown of your current opportunities.</p>
        </div>
        <Link href="/dashboard/offers/new" className={buttonVariants({ className: "gap-2" })}>
          <Plus className="h-4 w-4" /> New Offer
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Total Offers</h3>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{data.totalOffers}</div>
          <p className="text-xs text-muted-foreground mt-1">Across all statuses</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Pending Offers</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{data.pendingOffers}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting decision</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Highest Base Salary</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-primary">{formatCurrency(data.highestSalary)}</div>
          <p className="text-xs text-muted-foreground mt-1">Top compensation baseline</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Recent Offers</h2>
          {data.offers.length === 0 ? (
            <div className="p-8 border border-dashed border-border rounded-xl bg-card text-center">
              <p className="text-muted-foreground mb-4">No offers tracked yet.</p>
              <Link href="/dashboard/offers/new" className={buttonVariants({ variant: "outline", size: "sm" })}>
                Track an offer
              </Link>
            </div>
          ) : (
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <div className="divide-y divide-border">
                {data.offers.slice(0, 5).map(offer => (
                  <Link 
                    key={offer.id} 
                    href={`/dashboard/offers/${offer.id}`}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground">{offer.companyName}</div>
                      <div className="text-sm text-muted-foreground">{offer.jobTitle}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(offer.compensation?.baseSalary || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">{offer.status}</div>
                    </div>
                  </Link>
                ))}
              </div>
              {data.offers.length > 5 && (
                <div className="p-3 bg-muted/30 border-t border-border text-center">
                  <Link href="/dashboard/offers" className="text-sm font-medium text-primary hover:underline">
                    View all offers
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link 
              href="/dashboard/comparisons" 
              className="flex items-center gap-3 p-4 border border-border rounded-xl bg-card hover:border-primary/50 hover:bg-muted/30 transition-all group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Compare Offers</div>
                <div className="text-xs text-muted-foreground mt-0.5">Side-by-side analysis</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
