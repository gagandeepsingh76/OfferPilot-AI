"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { updatePreferenceSettings } from "@/server/actions/settings"
import type { AppPreferences } from "@/lib/current-user"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function PreferencesForm({ preferences }: { preferences: AppPreferences }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)

    try {
      const result = await updatePreferenceSettings(new FormData(event.currentTarget))
      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Preferences saved")
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-border rounded-lg p-6 bg-card space-y-4">
        <h4 className="text-md font-semibold">Workspace Defaults</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select id="theme" name="theme" defaultValue={preferences.theme} className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultCurrency">Default Currency</Label>
            <select id="defaultCurrency" name="defaultCurrency" defaultValue={preferences.defaultCurrency} className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-lg p-6 bg-card space-y-4">
        <h4 className="text-md font-semibold">Privacy</h4>
        <label className="flex items-center justify-between gap-6">
          <span>
            <span className="block text-sm font-medium">Anonymous benchmark contribution</span>
            <span className="block text-sm text-muted-foreground">Allow anonymized compensation totals to improve market insights.</span>
          </span>
          <input type="checkbox" name="shareAnonymizedBenchmarks" defaultChecked={preferences.privacy.shareAnonymizedBenchmarks} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
        </label>
      </div>

      <div className="flex justify-end">
        <Button disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </form>
  )
}
