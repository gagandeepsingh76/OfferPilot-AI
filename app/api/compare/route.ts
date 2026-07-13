import { NextRequest } from "next/server"
import { type Prisma } from "@prisma/client"
import { streamText } from "ai"
import { getOpenAI } from "@/lib/openai"
import { prisma } from "@/lib/prisma"
import { checkAiUsage, recordAiUsage, logAiJob } from "@/lib/ai-usage"
import { getCurrentAppUser } from "@/lib/current-user"
import { getDemoOffers } from "@/lib/demo-data"

type OfferWithCompensation = Prisma.OfferGetPayload<{ include: { compensation: true } }>

function textResponse(text: string, status = 200) {
  return new Response(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const appUser = await getCurrentAppUser()

  if (!appUser) {
    return textResponse("Please sign in to compare offers.", 401)
  }

  if (!appUser.dbUserId) {
    return textResponse("Your account is still being prepared. Refresh the dashboard and try again.", 409)
  }

  const hasUsage = await checkAiUsage(appUser.dbUserId, "AI_COMPARISON")
  if (!hasUsage) {
    return textResponse("You have reached the free comparison limit. Upgrade in Billing to continue.", 403)
  }

  let payload: { offerIds?: unknown }
  try {
    payload = await req.json()
  } catch {
    return textResponse("Invalid JSON request body.", 400)
  }

  try {
    const { offerIds } = payload

    if (!Array.isArray(offerIds) || offerIds.length < 2 || !offerIds.every((id): id is string => typeof id === "string")) {
      return textResponse("Select at least 2 offers to compare.", 400)
    }

    let offers: OfferWithCompensation[] = []
    try {
      offers = await prisma.offer.findMany({
        where: {
          id: { in: offerIds },
          userId: appUser.dbUserId,
        },
        include: { compensation: true }
      })
    } catch (error) {
      console.error("Failed to load offers for comparison:", error)
    }

    if (offers.length !== offerIds.length && appUser.isDemo) {
      const demoOffers = getDemoOffers().filter((offer) => offerIds.includes(offer.id))
      offers = demoOffers as OfferWithCompensation[]
    }

    if (offers.length !== offerIds.length) {
      return textResponse("One or more selected offers could not be loaded.", 404)
    }

    await recordAiUsage(appUser.dbUserId, "AI_COMPARISON")

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

    const openai = getOpenAI()
    if (!openai) {
      const totals = offers
        .map((offer) => {
          const comp = offer.compensation
          const total = (comp?.baseSalary || 0) + (comp?.bonus || 0) + (comp?.signOnBonus || 0) + (comp?.equity || 0)
          return `- **${offer.companyName}**: estimated package ${comp?.currency || "USD"} ${total.toLocaleString()} with ${offer.jobTitle}.`
        })
        .join("\n")

      return textResponse(
        `AI comparison is not configured in this environment, so here is a deterministic comparison from your saved offer data:\n\n${totals}\n\nRecommendation: prioritize the offer with the strongest mix of cash certainty, equity quality, role scope, and location fit. If two offers are close, negotiate the weaker package using the stronger offer as leverage.`
      )
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: "Please compare these offers and give me your recommendation.",
      async onFinish({ text, usage }) {
        await logAiJob(appUser.dbUserId!, {
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
    await logAiJob(appUser.dbUserId, {
      prompt: "Compare offers",
      processingTimeMs: Date.now() - startTime,
      status: "FAILED",
      error: error.message
    })
    return textResponse("We could not compare those offers right now. Please try again.", 500)
  }
}
