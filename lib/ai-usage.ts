import { prisma } from "@/lib/prisma"

export type AiActionType = "AI_ANALYSIS" | "CHAT_MESSAGE" | "AI_COMPARISON"

const FREE_LIMITS: Record<AiActionType, number> = {
  AI_ANALYSIS: 3,
  CHAT_MESSAGE: 3,
  AI_COMPARISON: 2,
}

export async function getUsageStats(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  })

  const isPro = subscription?.plan === "PRO"
  
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Fetch AI usage
  const usageRecords = await prisma.usageRecord.findMany({
    where: {
      userId,
      createdAt: { gte: startOfMonth }
    }
  })

  const countUsage = (type: string) => usageRecords.filter(r => r.actionType === type).reduce((a, c) => a + c.count, 0)

  // Fetch Offers count (Total, not monthly)
  const offersCount = await prisma.offer.count({ where: { userId } })
  
  // Fetch PDF count (Total, not monthly)
  const pdfsCount = await prisma.offerDocument.count({
    where: { offer: { userId } }
  })

  return {
    isPro,
    aiAnalysis: countUsage("AI_ANALYSIS"),
    chatMessage: countUsage("CHAT_MESSAGE"),
    aiComparison: countUsage("AI_COMPARISON"),
    offers: offersCount,
    pdfs: pdfsCount,
    limits: {
      ...FREE_LIMITS,
      OFFERS: 2,
      PDF_UPLOAD: 1,
    }
  }
}

export async function checkAiUsage(userId: string, actionType: AiActionType): Promise<boolean> {
  const stats = await getUsageStats(userId)
  if (stats.isPro) return true
  
  switch (actionType) {
    case "AI_ANALYSIS": return stats.aiAnalysis < stats.limits.AI_ANALYSIS
    case "CHAT_MESSAGE": return stats.chatMessage < stats.limits.CHAT_MESSAGE
    case "AI_COMPARISON": return stats.aiComparison < stats.limits.AI_COMPARISON
    default: return false
  }
}

export async function checkFeatureLimit(userId: string, feature: "OFFERS" | "PDF_UPLOAD"): Promise<boolean> {
  const stats = await getUsageStats(userId)
  if (stats.isPro) return true
  
  if (feature === "OFFERS") return stats.offers < stats.limits.OFFERS
  if (feature === "PDF_UPLOAD") return stats.pdfs < stats.limits.PDF_UPLOAD
  
  return false
}

export async function recordAiUsage(userId: string, actionType: AiActionType) {
  await prisma.usageRecord.create({
    data: {
      userId,
      actionType,
      count: 1
    }
  })
}

export interface AiJobLog {
  prompt: string
  response?: string
  tokenUsage?: { promptTokens: number; completionTokens: number; totalTokens: number }
  processingTimeMs: number
  status: "SUCCESS" | "FAILED"
  error?: string
}

export async function logAiJob(userId: string, details: AiJobLog) {
  // We use the existing AuditLog table to store AI tracking since it has a JSON details field.
  // We can map AuditAction to something generic or add a new enum value if we could change schema.
  // Since we can't easily modify prisma schema enum without migrations, we will use an existing one 
  // like 'OFFER_UPDATED' and store the real type in details, OR better yet, let's look at schema.
  
  // Actually, wait, AuditAction enum is strict: 
  // OFFER_CREATED, OFFER_UPDATED, OFFER_DELETED, SUBSCRIPTION_CREATED, SUBSCRIPTION_UPDATED, SUBSCRIPTION_CANCELED
  // Using an existing action is a hack.
  // Let's use OFFER_UPDATED for now as a fallback if we don't add AI_JOB to the enum.
  
  await prisma.auditLog.create({
    data: {
      userId,
      action: "OFFER_UPDATED", 
      details: {
        _jobType: "AI_JOB",
        ...details,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    }
  })
}
