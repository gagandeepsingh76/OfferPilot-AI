import { redirect } from "next/navigation"
import { getCurrentAppUser } from "@/lib/current-user"
import { ProfileForm } from "@/components/settings/profile-form"

export default async function ProfileSettingsPage() {
  const user = await getCurrentAppUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and career context.
        </p>
      </div>

      <ProfileForm
        name={user.name}
        email={user.email}
        avatarUrl={user.avatarUrl}
        currentRole={user.currentRole}
        experienceLevel={user.experienceLevel}
      />
    </div>
  )
}
