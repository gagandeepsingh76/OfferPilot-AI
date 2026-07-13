import { notFound } from "next/navigation"
import { ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"
import { OfferForm } from "@/components/offers/offer-form"
import { BenefitsValues, OfferFormValues } from "@/lib/validations/offer"
import { getOfferForCurrentUser } from "@/lib/offers-data"

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { offer, error } = await getOfferForCurrentUser(id)

  if (!offer) notFound()

  const initialData = {
    id: offer.id,
    companyName: offer.companyName,
    jobTitle: offer.jobTitle,
    location: offer.location || undefined,
    status: offer.status,
    notes: offer.notes || undefined,
    baseSalary: offer.compensation?.baseSalary || 0,
    currency: offer.compensation?.currency || "USD",
    bonus: offer.compensation?.bonus || undefined,
    equity: offer.compensation?.equity || undefined,
    equityType: offer.compensation?.equityType || undefined,
    signOnBonus: offer.compensation?.signOnBonus || undefined,
    ptoDays: offer.compensation?.ptoDays || undefined,
    benefits: (offer.compensation?.benefits as unknown as BenefitsValues) || {
      healthInsurance: false,
      dentalInsurance: false,
      visionInsurance: false,
      retirementPlan: false,
      relocation: false,
      learningBudget: false,
      wfhAllowance: false,
      flexibleHours: false,
      other: "",
    },
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-8">
        <Link
          href="/dashboard/offers"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to offers
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{offer.companyName} Offer</h1>
            <p className="text-muted-foreground mt-1">
              {offer.jobTitle} {offer.location ? `- ${offer.location}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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

      <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
        <OfferForm initialData={initialData as OfferFormValues & { id: string }} />
      </div>
    </div>
  )
}
