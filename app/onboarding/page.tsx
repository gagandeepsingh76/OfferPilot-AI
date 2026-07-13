import { redirect } from "next/navigation"
import Link from "next/link"
import { ProfileForm } from "@/components/settings/profile-form"
import { getCurrentAppUser } from "@/lib/current-user"
import { buttonVariants } from "@/components/ui/button"

export default async function OnboardingPage() {
  const user = await getCurrentAppUser()
  if (!user) redirect("/login")

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Set up your workspace</h1>
          <p className="mt-2 text-muted-foreground">
            Add a few career details so OfferPilot can tailor insights and negotiation guidance.
          </p>
        </div>

        <ProfileForm
          name={user.name}
          email={user.email}
          avatarUrl={user.avatarUrl}
          currentRole={user.currentRole}
          experienceLevel={user.experienceLevel}
        />

        <div className="flex justify-end">
          <Link href="/dashboard" className={buttonVariants()}>
            Continue to Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
