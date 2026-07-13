"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ResumeReviewer() {
  const [targetRole, setTargetRole] = useState("Senior Software Engineer")
  const [resumeText, setResumeText] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/resume-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, resumeText }),
      })

      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || "We could not review that resume.")
        return
      }

      setResult(data.review)
    } catch {
      toast.error("Resume review is unavailable right now.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="targetRole">Target Role</Label>
          <Input id="targetRole" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resumeText">Resume Text</Label>
          <textarea
            id="resumeText"
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste resume text here..."
            className="min-h-80 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button type="submit" disabled={isLoading || resumeText.trim().length < 80} className="gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Review Resume
        </Button>
      </form>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Review</h2>
        <div className="prose prose-sm dark:prose-invert mt-4 max-w-none">
          {result ? (
            <ReactMarkdown>{result}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">
              Paste a resume and run a review to get role fit, compensation positioning, and negotiation improvements.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
