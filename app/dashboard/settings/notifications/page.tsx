import { redirect } from "next/navigation"
import { getCurrentAppUser } from "@/lib/current-user"
import { NotificationsForm } from "@/components/settings/notifications-form"

export default async function NotificationsSettingsPage() {
  const user = await getCurrentAppUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Choose which product, billing, and security emails you receive.
        </p>
      </div>

      <NotificationsForm preferences={user.preferences} />
    </div>
  )
}
