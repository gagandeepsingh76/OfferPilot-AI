import { OfferForm } from "@/components/offers/offer-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewOfferPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Add New Offer</h1>
        <p className="text-muted-foreground mt-2">
          Enter the details of your job offer. You can attach the official offer letter for AI analysis later.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
        <OfferForm />
      </div>
    </div>
  )
}
