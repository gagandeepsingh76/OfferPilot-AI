"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { updateProfileSettings } from "@/server/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProfileFormProps {
  name: string
  email: string
  avatarUrl: string
  currentRole?: string | null
  experienceLevel?: string | null
}

export function ProfileForm({ name, email, avatarUrl, currentRole, experienceLevel }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)

    try {
      const result = await updateProfileSettings(new FormData(event.currentTarget))
      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Profile updated")
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 bg-card space-y-6">
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" defaultValue={name} placeholder="Your full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue={email} disabled />
          <p className="text-xs text-muted-foreground">Your email address is managed by your authentication provider.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input id="avatarUrl" name="avatarUrl" defaultValue={avatarUrl} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentRole">Current Role</Label>
          <Input id="currentRole" name="currentRole" defaultValue={currentRole || ""} placeholder="Senior Software Engineer" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Experience Level</Label>
          <Input id="experienceLevel" name="experienceLevel" defaultValue={experienceLevel || ""} placeholder="5+ years" />
        </div>
        <Button type="submit" className="mt-2" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Profile
        </Button>
      </div>
    </form>
  )
}
