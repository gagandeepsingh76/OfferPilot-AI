import { notFound } from "next/navigation"
import { ArrowLeft, BriefcaseBusiness, CalendarDays, DollarSign, Edit, FileText, MapPin, MessageSquare } from "lucide-react"
import Link from "next/link"
import { getOfferForCurrentUser } from "@/lib/offers-data"
import { buttonVariants } from "@/components/ui/button"

const benefitLabels: Record<string, string> = {
  healthInsurance: "Health insurance",
  dentalInsurance: "Dental insurance",
  visionInsurance: "Vision insurance",
  retirementPlan: "Retirement plan",
  relocation: "Relocation",
  learningBudget: "Learning budget",
  wfhAllowance: "WFH allowance",
  flexibleHours: "Flexible hours",
}

function statusClass(status: string) {
  if (status === "ACCEPTED") return "bg-green-500/10 text-green-600 border-green-500/20"
  if (status === "REJECTED") return "bg-red-500/10 text-red-600 border-red-500/20"
  if (status === "ARCHIVED") return "bg-gray-500/10 text-gray-600 border-gray-500/20"
  return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
}

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { offer, error } = await getOfferForCurrentUser(id)

  if (!offer) notFound()

  const compensation = offer.compensation
  const currency = compensation?.currency || "USD"
  const baseSalary = compensation?.baseSalary || 0
  const signOnBonus = compensation?.signOnBonus || 0
  const bonus = compensation?.bonus || 0
  const equity = compensation?.equity || 0
  const totalComp = baseSalary + signOnBonus + bonus + equity
  const benefits = (compensation?.benefits || {}) as Record<string, unknown>
  const activeBenefits = Object.entries(benefitLabels).filter(([key]) => Boolean(benefits[key]))
  const otherBenefits = typeof benefits.other === "string" ? benefits.other : ""
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <Link
          href="/dashboard/offers"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to offers
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass(offer.status)}`}>
              {offer.status}
            </span>
            <h1 className="text-3xl font-bold tracking-tight">{offer.companyName}</h1>
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness className="h-4 w-4" />
                {offer.jobTitle}
              </span>
              {offer.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {offer.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/dashboard/offers/${offer.id}/edit`} className={buttonVariants({ variant: "outline", className: "gap-2" })}>
              <Edit className="h-4 w-4" />
              Edit Offer
            </Link>
            <Link
              href={`/dashboard/offers/${offer.id}/chat`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-primary/10 text-primary shadow-sm hover:bg-primary/20 h-9 px-4 py-2"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Negotiation Coach
            </Link>
            {offer.documents.length > 0 && (
              <a
                href={offer.documents[0].fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                View PDF
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            Base salary
          </div>
          <p className="mt-3 text-2xl font-bold">{formatCurrency(baseSalary)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            Total comp
          </div>
          <p className="mt-3 text-2xl font-bold text-primary">{formatCurrency(totalComp)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            PTO
          </div>
          <p className="mt-3 text-2xl font-bold">{compensation?.ptoDays || 0} days</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            Documents
          </div>
          <p className="mt-3 text-2xl font-bold">{offer.documents.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Compensation breakdown</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Base salary</dt>
              <dd className="mt-1 font-medium">{formatCurrency(baseSalary)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Sign-on bonus</dt>
              <dd className="mt-1 font-medium">{formatCurrency(signOnBonus)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Target bonus</dt>
              <dd className="mt-1 font-medium">{formatCurrency(bonus)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Equity value</dt>
              <dd className="mt-1 font-medium">
                {formatCurrency(equity)}
                {compensation?.equityType ? ` ${compensation.equityType}` : ""}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Benefits</h2>
          {activeBenefits.length > 0 || otherBenefits ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {activeBenefits.map(([, label]) => (
                <span key={label} className="rounded-full border border-border bg-muted px-3 py-1 text-sm">
                  {label}
                </span>
              ))}
              {otherBenefits && (
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm">
                  {otherBenefits}
                </span>
              )}
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">No benefits recorded for this offer yet.</p>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {offer.notes || "No notes added yet."}
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Documents</h2>
          {offer.documents.length > 0 ? (
            <div className="mt-4 space-y-3">
              {offer.documents.map((document) => (
                <a
                  key={document.id}
                  href={document.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted"
                >
                  <span className="font-medium">{document.fileName}</span>
                  <span className="text-muted-foreground">Open</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No offer documents uploaded yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
