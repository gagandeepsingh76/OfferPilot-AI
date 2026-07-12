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

  const hasUsage = await checkAiUsage(prismaUser.id, "CHAT_MESSAGE")
  if (!hasUsage) {
    return new Response("Free plan limit reached. Upgrade to Pro.", { status: 403 })
  }

  const openai = getOpenAI()
  if (!openai) {
    return NextResponse.json({ error: "AI features are currently unavailable. Please configure OpenAI." }, { status: 503 })
  }

  try {
    const { messages, offerId } = await req.json()

    // Fetch Offer context
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { compensation: true }
    })

    if (!offer || offer.userId !== prismaUser.id) {
      return new Response("Offer not found or unauthorized", { status: 404 })
    }

    // System prompt with offer context
    const systemPrompt = `
      You are an expert AI Negotiation Coach helping a candidate negotiate their job offer.
      You are professional, strategic, and concise.

      Here are the details of the offer:
      Company: ${offer.companyName}
      Role: ${offer.jobTitle}
      Base Salary: ${offer.compensation?.currency} ${offer.compensation?.baseSalary}
      Target Bonus: ${offer.compensation?.bonus || "N/A"}
      Equity: ${offer.compensation?.equity || "N/A"} ${offer.compensation?.equityType || ""}
      Sign-on Bonus: ${offer.compensation?.signOnBonus || "N/A"}
      PTO: ${offer.compensation?.ptoDays || "N/A"} days
      Status: ${offer.status}

      Help the user formulate negotiation strategies, write emails, and evaluate their leverage.
    `

    await recordAiUsage(prismaUser.id, "CHAT_MESSAGE")

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages,
      async onFinish({ text, usage }) {
        await logAiJob(prismaUser.id, {
          prompt: messages[messages.length - 1]?.content || "",
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
    console.error("AI Chat failed:", error)
    await logAiJob(prismaUser.id, {
      prompt: "Chat request",
      processingTimeMs: Date.now() - startTime,
      status: "FAILED",
      error: error.message
    })
    return new Response("Failed to process chat", { status: 500 })
  }
}
