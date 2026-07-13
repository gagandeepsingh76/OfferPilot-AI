import Link from "next/link"

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Cookie Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>OfferPilot AI uses essential cookies for authentication, session refresh, theme preference, and demo mode.</p>
        <p>The demo mode cookie is temporary and lets visitors explore a seeded dashboard without creating an account.</p>
        <p>Third-party services such as Stripe and Supabase may set cookies during checkout or authentication flows.</p>
      </div>
    </main>
  )
}
