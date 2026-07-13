import Link from "next/link"

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        OfferPilot AI treats compensation data, resumes, and offer documents as private career information. User data is used only to provide offer analysis, comparison, resume review, billing, and account features.
      </p>
      <div className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>Uploaded documents are associated with the authenticated account that uploaded them. Access is controlled through Supabase Auth and application-level ownership checks.</p>
        <p>We do not sell personal compensation data. Optional benchmark contribution settings can be managed from dashboard preferences.</p>
        <p>Billing data is processed by Stripe. OfferPilot AI stores subscription identifiers and plan status, not full payment card details.</p>
      </div>
    </main>
  )
}
