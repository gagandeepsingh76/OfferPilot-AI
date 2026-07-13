import Link from "next/link"

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Terms of Service</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>OfferPilot AI provides decision-support tools for job offer evaluation, resume review, and negotiation preparation. It does not replace legal, tax, financial, or immigration advice.</p>
        <p>Users are responsible for verifying offer terms, employer policies, and documents before making career decisions.</p>
        <p>Subscriptions are managed through Stripe and can be changed from the Billing settings page when Stripe is configured.</p>
      </div>
    </main>
  )
}
