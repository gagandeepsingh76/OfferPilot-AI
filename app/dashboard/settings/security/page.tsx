import { Key, Shield } from "lucide-react"
import { SecurityForm } from "@/components/settings/security-form"

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage password access and account protection.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <h4 className="text-md font-semibold">Change Password</h4>
          </div>
          <SecurityForm />
        </div>

        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h4 className="text-md font-semibold">Two-Factor Authentication</h4>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Supabase supports multi-factor authentication at the provider level. Enable it in your Supabase project to require an additional verification factor for sign-in.
          </p>
        </div>
      </div>
    </div>
  )
}
