import { redirect } from "next/navigation"
import { getCurrentAppUser } from "@/lib/current-user"
import { PreferencesForm } from "@/components/settings/preferences-form"

export default async function PreferencesSettingsPage() {
  const user = await getCurrentAppUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage workspace defaults and privacy choices.
        </p>
      </div>

      <PreferencesForm preferences={user.preferences} />
    </div>
  )
}
