import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield, Key } from "lucide-react"

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your password and security settings.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <h4 className="text-md font-semibold">Change Password</h4>
          </div>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input id="new" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input id="confirm" type="password" />
            </div>
            <Button>Update Password</Button>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h4 className="text-md font-semibold">Two-Factor Authentication</h4>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Add an extra layer of security to your account by enabling two-factor authentication. 
            Once enabled, you&apos;ll be required to enter both your password and an authentication code from your mobile device to sign in.
          </p>
          <Button variant="outline">Enable 2FA</Button>
        </div>
      </div>
    </div>
  )
}
