import { NextRequest } from "next/server"
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, streamText, type UIMessage } from "ai"
import { getOpenAI } from "@/lib/openai"
import { prisma } from "@/lib/prisma"
import { checkAiUsage, recordAiUsage, logAiJob } from "@/lib/ai-usage"
import { getCurrentAppUser } from "@/lib/current-user"
import { getDemoOfferById } from "@/lib/demo-data"

function fallbackChatResponse(message: string) {
  const stream = createUIMessageStream<UIMessage>({
    execute({ writer }) {
      const id = "fallback-text"
      writer.write({ type: "start" })
      writer.write({ type: "text-start", id })
      writer.write({ type: "text-delta", id, delta: message })
      writer.write({ type: "text-end", id })
      writer.write({ type: "finish", finishReason: "stop" })
    },
  })

  return createUIMessageStreamResponse({ stream })
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const appUser = await getCurrentAppUser()

  if (!appUser) {
    return fallbackChatResponse("Please sign in to use the negotiation coach.")
  }

  if (!appUser.dbUserId) {
    return fallbackChatResponse("Your account is still being prepared. Refresh the dashboard and try again.")
  }

  const hasUsage = await checkAiUsage(appUser.dbUserId, "CHAT_MESSAGE")
  if (!hasUsage) {
    return fallbackChatResponse("You have reached the free chat limit. Upgrade in Billing to continue.")
  }

  try {
    const { messages, offerId } = await req.json()

    // Fetch Offer context
    let offer = null
    try {
      offer = await prisma.offer.findUnique({
        where: { id: offerId },
        include: { compensation: true }
      })
    } catch (error) {
      console.error("Failed to load offer for chat:", error)
    }

    if ((!offer || offer.userId !== appUser.dbUserId) && appUser.isDemo) {
      offer = getDemoOfferById(offerId) as typeof offer
    }

    if (!offer || offer.userId !== appUser.dbUserId) {
      return fallbackChatResponse("I could not find that offer. Go back to Offers and reopen the negotiation coach.")
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

    const openai = getOpenAI()
    await recordAiUsage(appUser.dbUserId, "CHAT_MESSAGE")

    if (!openai) {
      return fallbackChatResponse(
        `AI chat is not configured in this environment, but here is a practical starting point for ${offer.companyName}: focus your negotiation on the highest-leverage gaps first. Ask for one or two specific improvements, such as a higher sign-on bonus, clearer equity refreshers, or more flexibility, and anchor the request in the value you bring to the role.`
      )
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      async onFinish({ text, usage }) {
        await logAiJob(appUser.dbUserId!, {
          prompt: "Chat request",
          response: text,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tokenUsage: usage as any,
          processingTimeMs: Date.now() - startTime,
          status: "SUCCESS"
        })
      }
    })

    return result.toUIMessageStreamResponse()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("AI Chat failed:", error)
    await logAiJob(appUser.dbUserId, {
      prompt: "Chat request",
      processingTimeMs: Date.now() - startTime,
      status: "FAILED",
      error: error.message
    })
    return fallbackChatResponse("The negotiation coach could not complete that request. Please try again in a moment.")
  }
}
