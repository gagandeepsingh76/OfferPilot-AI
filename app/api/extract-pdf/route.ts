import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { checkAiUsage, recordAiUsage, logAiJob } from "@/lib/ai-usage"


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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const prismaUser = await prisma.user.findUnique({ where: { authId: user.id } })
  if (!prismaUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const hasUsage = await checkAiUsage(prismaUser.id, "AI_ANALYSIS")
  if (!hasUsage) {
    return NextResponse.json({ error: "Free plan limit reached. Upgrade to Pro." }, { status: 403 })
  }

  let promptData = ""

  try {
    const { fileUrl } = await req.json()
    if (!fileUrl) throw new Error("Missing fileUrl")

    promptData = fileUrl

    // Fetch and parse PDF
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdf = require("pdf-parse")
    
    const response = await fetch(fileUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const parsed = await pdf(buffer)
    const pdfText = parsed.text

    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error("Could not extract text from PDF")
    }

    const { object, usage } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ExtractSchema,
      prompt: `Extract the job offer details from the following text parsed from a PDF. If you cannot find a specific field, leave it blank or false. \n\nPDF TEXT:\n${pdfText.substring(0, 30000)}`,
    })

    await recordAiUsage(prismaUser.id, "AI_ANALYSIS")
    
    await logAiJob(prismaUser.id, {
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
    
    await logAiJob(prismaUser.id, {
      prompt: promptData,
      processingTimeMs: Date.now() - startTime,
      status: "FAILED",
      error: error.message
    })

    return NextResponse.json({ error: error.message || "Failed to process PDF" }, { status: 500 })
  }
}
