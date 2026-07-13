import { ResumeReviewer } from "@/components/resume/resume-reviewer"

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Review</h1>
        <p className="mt-1 text-muted-foreground">
          Tune your resume for stronger offer leverage before interviews and negotiations.
        </p>
      </div>

      <ResumeReviewer />
    </div>
  )
}
