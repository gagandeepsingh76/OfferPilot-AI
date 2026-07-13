import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { getOpenAI } from "@/lib/openai"
import { getCurrentAppUser } from "@/lib/current-user"
import { checkAiUsage, logAiJob, recordAiUsage } from "@/lib/ai-usage"

function fallbackReview(targetRole: string, resumeText: string) {
  const hasMetrics = /\d|%|\$/.test(resumeText)
  const hasLeadership = /led|owned|managed|mentored|architected/i.test(resumeText)
  const hasImpact = /revenue|latency|cost|growth|retention|conversion|availability|scale/i.test(resumeText)

  return `## Resume Review for ${targetRole}

### Strengths
- The resume gives enough context to start positioning you for ${targetRole}.
- ${hasLeadership ? "Leadership signals are present; keep them tied to scope and outcomes." : "Add leadership scope, ownership, mentoring, or cross-functional influence where true."}

### Highest-Impact Improvements
- ${hasMetrics ? "Keep the quantified bullets, and move the strongest metrics into the top third of the resume." : "Add concrete numbers: revenue, cost savings, latency, scale, users, uptime, hiring impact, or delivery speed."}
- ${hasImpact ? "Tie each project to business or product impact so compensation discussions have stronger leverage." : "Translate technical work into business impact so recruiters can understand seniority quickly."}
- Mirror the target role language in your summary and most recent role.

### Negotiation Positioning
- Prepare two stories that prove scope: one technical depth story and one cross-functional impact story.
- Use the strongest quantified achievement as your anchor when explaining why you are targeting the upper end of the compensation band.`
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const appUser = await getCurrentAppUser()

  if (!appUser) {
    return NextResponse.json({ error: "Please sign in to review a resume." }, { status: 401 })
  }

  if (!appUser.dbUserId) {
    return NextResponse.json({ error: "Your account is still being prepared. Refresh the dashboard and try again." }, { status: 409 })
  }

  let payload: { targetRole?: unknown; resumeText?: unknown }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const { targetRole, resumeText } = payload
  const role = typeof targetRole === "string" && targetRole.trim() ? targetRole.trim() : "your target role"
  const text = typeof resumeText === "string" ? resumeText.trim() : ""

  if (text.length < 80) {
    return NextResponse.json({ error: "Paste at least a few resume bullets before running a review." }, { status: 400 })
  }

  const hasUsage = await checkAiUsage(appUser.dbUserId, "AI_ANALYSIS")
  if (!hasUsage) {
    return NextResponse.json({ error: "Free plan limit reached. Upgrade to Pro." }, { status: 403 })
  }

  await recordAiUsage(appUser.dbUserId, "AI_ANALYSIS")

  const openai = getOpenAI()
  if (!openai) {
    return NextResponse.json({ review: fallbackReview(role, text) })
  }

  try {
    const { text: review, usage } = await generateText({
      model: openai("gpt-4o-mini"),
      system: "You are a senior career coach and compensation strategist. Review resumes for role fit, impact clarity, and negotiation leverage. Be specific and concise.",
      prompt: `Target role: ${role}\n\nResume:\n${text.slice(0, 30000)}`,
    })

    await logAiJob(appUser.dbUserId, {
      prompt: `Resume review for ${role}`,
      response: review,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tokenUsage: usage as any,
      processingTimeMs: Date.now() - startTime,
      status: "SUCCESS",
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Resume review failed:", error)
    await logAiJob(appUser.dbUserId, {
      prompt: `Resume review for ${role}`,
      processingTimeMs: Date.now() - startTime,
      status: "FAILED",
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json({ review: fallbackReview(role, text) })
  }
}
