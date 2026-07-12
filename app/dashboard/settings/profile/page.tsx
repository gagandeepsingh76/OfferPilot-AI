import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function ProfileSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const email = user?.email || "demo@offerpilot.ai"
  const name = user?.user_metadata?.full_name || "Demo User"

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>
      
      <div className="border border-border rounded-lg p-6 bg-card space-y-6">
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={name} placeholder="Your full name" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={email} disabled />
            <p className="text-xs text-muted-foreground">Your email address is managed by your authentication provider.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" placeholder="e.g. Software Engineer" />
          </div>
          
          <Button className="mt-2">Update Profile</Button>
        </div>
      </div>
    </div>
  )
}
