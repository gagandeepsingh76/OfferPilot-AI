import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PreferencesSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage your app preferences and notifications.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <h4 className="text-md font-semibold">Email Notifications</h4>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Offer Insights</Label>
              <p className="text-sm text-muted-foreground">Receive weekly insights on salary trends.</p>
            </div>
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Product Updates</Label>
              <p className="text-sm text-muted-foreground">Receive updates about new features and improvements.</p>
            </div>
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <h4 className="text-md font-semibold">Appearance</h4>
          <div className="space-y-2 max-w-sm">
            <Label>Theme</Label>
            <Select defaultValue="system">
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Choose your preferred visual theme.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Preferences</Button>
        </div>
      </div>
    </div>
  )
}
