import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { getOpenAI } from "@/lib/openai"
import { z } from "zod"
import { checkAiUsage, recordAiUsage, logAiJob } from "@/lib/ai-usage"
import { getCurrentAppUser } from "@/lib/current-user"


const ExtractSchema = z.object({
  companyName: z.string().describe("The name of the company making the offer"),
  jobTitle: z.string().describe("The job title or position"),
  location: z.string().optional().describe("The location of the job, or Remote"),
  baseSalary: z.number().describe("The annual base salary as a number"),
  currency: z.string().describe("The currency, e.g. USD, EUR, GBP"),
  signOnBonus: z.number().optional().describe("Any sign-on or joining bonus"),
  bonus: z.number().optional().describe("Target annual bonus"),
  equity: z.number().optional().describe("Total equity value offered"),
  equityType: z.string().optional().describe("RSU, Options, etc."),
  ptoDays: z.number().optional().describe("Number of PTO or vacation days"),
  benefits: z.object({
    healthInsurance: z.boolean(),
    dentalInsurance: z.boolean(),
    visionInsurance: z.boolean(),
    retirementPlan: z.boolean(),
    relocation: z.boolean(),
    learningBudget: z.boolean(),
    wfhAllowance: z.boolean(),
    flexibleHours: z.boolean(),
    other: z.string().optional(),
  }),
  confidenceScore: z.number().min(0).max(100).describe("How confident the AI is in this extraction (0-100)"),
})

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const appUser = await getCurrentAppUser()

  if (!appUser) {
    return NextResponse.json({ error: "Please sign in to analyze an offer document." }, { status: 401 })
  }

  if (!appUser.dbUserId) {
    return NextResponse.json({ error: "Your account is still being prepared. Refresh the dashboard and try again." }, { status: 409 })
  }

  const hasUsage = await checkAiUsage(appUser.dbUserId, "AI_ANALYSIS")
  if (!hasUsage) {
    return NextResponse.json({ error: "Free plan limit reached. Upgrade to Pro." }, { status: 403 })
  }

  let promptData = ""

  try {
    const { fileUrl } = await req.json()
    if (!fileUrl) {
      return NextResponse.json({ error: "Upload a PDF before running analysis." }, { status: 400 })
    }

    promptData = fileUrl

    // Fetch and parse PDF
    const response = await fetch(fileUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "We could not read that PDF. Please check the upload and try again." }, { status: 400 })
    }
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const { PDFParse } = await import("pdf-parse")
    const parser = new PDFParse({ data: buffer })
    const parsed = await parser.getText()
    await parser.destroy()
    const pdfText = parsed.text

    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json({ error: "We could not extract text from that PDF. You can still enter the offer details manually." }, { status: 422 })
    }

    const openai = getOpenAI()
    if (!openai) {
      return NextResponse.json({
        error: "AI extraction is not configured in this environment. You can still enter the offer details manually.",
      }, { status: 503 })
    }

    const { object, usage } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ExtractSchema,
      prompt: `Extract the job offer details from the following text parsed from a PDF. If you cannot find a specific field, leave it blank or false. \n\nPDF TEXT:\n${pdfText.substring(0, 30000)}`,
    })

    await recordAiUsage(appUser.dbUserId, "AI_ANALYSIS")
    
    await logAiJob(appUser.dbUserId, {
      prompt: "Extract offer from PDF",
      response: JSON.stringify(object),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tokenUsage: usage as any,
      processingTimeMs: Date.now() - startTime,
      status: "SUCCESS"
    })

    return NextResponse.json({ data: object })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("AI Extraction failed:", error)
    
    await logAiJob(appUser.dbUserId, {
      prompt: promptData,
      processingTimeMs: Date.now() - startTime,
      status: "FAILED",
      error: error.message
    })

    return NextResponse.json({ error: "We could not analyze that PDF. You can still enter the offer details manually." }, { status: 500 })
  }
}
