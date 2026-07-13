"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { updateNotificationSettings } from "@/server/actions/settings"
import type { AppPreferences } from "@/lib/current-user"
import { Button } from "@/components/ui/button"

const notificationRows = [
  ["offerInsights", "Offer insights", "Weekly compensation trend and deadline reminders."],
  ["productUpdates", "Product updates", "New dashboard, parsing, and comparison improvements."],
  ["billingAlerts", "Billing alerts", "Receipts, renewal notices, and subscription changes."],
  ["securityAlerts", "Security alerts", "Important account and authentication notices."],
] as const

export function NotificationsForm({ preferences }: { preferences: AppPreferences }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)

    try {
      const result = await updateNotificationSettings(new FormData(event.currentTarget))
      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Notification settings saved")
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-border rounded-lg bg-card divide-y divide-border">
        {notificationRows.map(([key, label, description]) => (
          <label key={key} className="flex items-center justify-between gap-6 p-5">
            <span>
              <span className="block text-sm font-medium">{label}</span>
              <span className="block text-sm text-muted-foreground">{description}</span>
            </span>
            <input type="checkbox" name={key} defaultChecked={preferences.notifications[key]} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
          </label>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Notifications
        </Button>
      </div>
    </form>
  )
}
