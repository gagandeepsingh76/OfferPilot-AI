import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { OfferForm } from "@/components/offers/offer-form"
import { BenefitsValues, OfferFormValues } from "@/lib/validations/offer"

async function getOffer(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const prismaUser = await prisma.user.findUnique({ where: { authId: user.id } })
  if (!prismaUser) return null

  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      compensation: true,
      documents: true,
    }
  })

  if (!offer || offer.userId !== prismaUser.id) return null
  return offer
}

export default async function EditOfferPage({ params }: { params: { id: string } }) {
  const offer = await getOffer(params.id)
  if (!offer) notFound()

  // Map to form values
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
      <div className="mb-8">
        <Link 
          href="/dashboard/offers" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to offers
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{offer.companyName} Offer</h1>
            <p className="text-muted-foreground mt-1">
              {offer.jobTitle} {offer.location ? `• ${offer.location}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
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
