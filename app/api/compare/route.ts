import { NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { getOpenAI } from "@/lib/openai"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { checkAiUsage, recordAiUsage, logAiJob } from "@/lib/ai-usage"

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const prismaUser = await prisma.user.findUnique({ where: { authId: user.id } })
  if (!prismaUser) {
    return new Response("User not found", { status: 404 })
  }

  const hasUsage = await checkAiUsage(prismaUser.id, "AI_COMPARISON")
  if (!hasUsage) {
    return new Response("Free plan limit reached. Upgrade to Pro.", { status: 403 })
  }

  try {
    const { offerIds } = await req.json()

    if (!Array.isArray(offerIds) || offerIds.length < 2) {
      return new Response("At least 2 offers are required for comparison", { status: 400 })
    }

    const offers = await prisma.offer.findMany({
      where: {
        id: { in: offerIds },
        userId: prismaUser.id,
      },
      include: { compensation: true }
    })

    if (offers.length !== offerIds.length) {
      return new Response("One or more offers not found or unauthorized", { status: 404 })
    }

    // Format offers for the AI
    const offersContext = offers.map((o, idx) => `
      Offer ${idx + 1}:
      Company: ${o.companyName}
      Role: ${o.jobTitle}
      Location: ${o.location || "N/A"}
      Base Salary: ${o.compensation?.currency} ${o.compensation?.baseSalary}
      Bonus: ${o.compensation?.bonus || 0}
      Equity: ${o.compensation?.equity || 0} ${o.compensation?.equityType || ""}
      Sign-on Bonus: ${o.compensation?.signOnBonus || 0}
      PTO: ${o.compensation?.ptoDays || 0} days
      Benefits: ${JSON.stringify(o.compensation?.benefits || {})}
    `).join("\n\n")

    const systemPrompt = `
      You are an expert AI Career and Compensation Analyst. 
      The user is deciding between multiple job offers.
      
      Compare the following offers:
      ${offersContext}

      Provide a structured analysis:
      1. Estimated Total Compensation for each.
      2. Strengths and Weaknesses of each offer.
      3. A clear recommendation on which offer is objectively better and why.
      
      Format the output using markdown. Be professional, analytical, and concise.
    `

    await recordAiUsage(prismaUser.id, "AI_COMPARISON")

    const openai = getOpenAI()
    if (!openai) {
      return NextResponse.json({ error: "AI features are currently unavailable. Please configure OpenAI." }, { status: 503 })
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: "Please compare these offers and give me your recommendation.",
      async onFinish({ text, usage }) {
        await logAiJob(prismaUser.id, {
          prompt: `Compare ${offers.length} offers`,
          response: text,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tokenUsage: usage as any,
          processingTimeMs: Date.now() - startTime,
          status: "SUCCESS"
        })
      }
    })

    return result.toTextStreamResponse()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("AI Comparison failed:", error)
    await logAiJob(prismaUser.id, {
      prompt: "Compare offers",
      processingTimeMs: Date.now() - startTime,
      status: "FAILED",
      error: error.message
    })
    return new Response("Failed to compare offers", { status: 500 })
  }
}
