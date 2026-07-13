import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Prisma, type PlanType } from "@prisma/client"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import {
  DEMO_AUTH_ID,
  DEMO_EMAIL,
  demoPreferences,
  demoUser,
} from "@/lib/demo-data"
import { isSubscriptionActive } from "@/lib/subscription"

export type AppPreferences = typeof demoPreferences

export interface AppUser {
  authId: string
  dbUserId: string | null
  email: string
  name: string
  avatarUrl: string
  isDemo: boolean
  plan: PlanType
  currentRole?: string | null
  experienceLevel?: string | null
  preferences: AppPreferences
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function asString(value: unknown) {
  return typeof value === "string" ? value : ""
}

export function getSupabaseDisplayName(user: SupabaseUser) {
  const metadata = user.user_metadata ?? {}
  const metadataName =
    asString(metadata.full_name) ||
    asString(metadata.name) ||
    asString(metadata.user_name)

  if (metadataName) return metadataName
  if (user.email) return user.email.split("@")[0]

  return "OfferPilot User"
}

export function getSupabaseAvatarUrl(user: SupabaseUser) {
  const metadata = user.user_metadata ?? {}
  return asString(metadata.avatar_url) || asString(metadata.picture)
}

export function mergePreferences(value: unknown): AppPreferences {
  if (!isRecord(value)) return demoPreferences

  const notifications = isRecord(value.notifications) ? value.notifications : {}
  const privacy = isRecord(value.privacy) ? value.privacy : {}
  const theme = asString(value.theme)
  const defaultCurrency = asString(value.defaultCurrency)

  return {
    ...demoPreferences,
    theme: ["light", "dark", "system"].includes(theme) ? theme : demoPreferences.theme,
    defaultCurrency: defaultCurrency || demoPreferences.defaultCurrency,
    notifications: {
      ...demoPreferences.notifications,
      offerInsights:
        typeof notifications.offerInsights === "boolean"
          ? notifications.offerInsights
          : demoPreferences.notifications.offerInsights,
      productUpdates:
        typeof notifications.productUpdates === "boolean"
          ? notifications.productUpdates
          : demoPreferences.notifications.productUpdates,
      billingAlerts:
        typeof notifications.billingAlerts === "boolean"
          ? notifications.billingAlerts
          : demoPreferences.notifications.billingAlerts,
      securityAlerts:
        typeof notifications.securityAlerts === "boolean"
          ? notifications.securityAlerts
          : demoPreferences.notifications.securityAlerts,
    },
    privacy: {
      ...demoPreferences.privacy,
      shareAnonymizedBenchmarks:
        typeof privacy.shareAnonymizedBenchmarks === "boolean"
          ? privacy.shareAnonymizedBenchmarks
          : demoPreferences.privacy.shareAnonymizedBenchmarks,
    },
  }
}

export async function getCurrentAppUser(): Promise<AppUser | null> {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get("demo_mode")?.value === "true"

  if (isDemo) {
    return {
      authId: DEMO_AUTH_ID,
      dbUserId: DEMO_AUTH_ID,
      email: DEMO_EMAIL,
      name: demoUser.name,
      avatarUrl: demoUser.avatarUrl,
      isDemo: true,
      plan: "PRO",
      currentRole: "Senior Software Engineer",
      experienceLevel: "5+ years",
      preferences: demoPreferences,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  const email = user.email || asString(user.user_metadata?.email)
  if (!email) return null

  const name = getSupabaseDisplayName(user)
  const avatarUrl = getSupabaseAvatarUrl(user)

  try {
    const dbUser = await prisma.user.upsert({
      where: { authId: user.id },
      update: {
        email,
        name,
        avatarUrl,
      },
      create: {
        authId: user.id,
        email,
        name,
        avatarUrl,
      },
    })

    const profile = await prisma.profile.upsert({
      where: { userId: dbUser.id },
      update: {},
      create: {
        userId: dbUser.id,
        preferences: demoPreferences as Prisma.InputJsonValue,
      },
    })

    const subscription = await prisma.subscription.upsert({
      where: { userId: dbUser.id },
      update: {},
      create: {
        userId: dbUser.id,
        plan: "FREE",
      },
    })

    return {
      authId: user.id,
      dbUserId: dbUser.id,
      email,
      name: dbUser.name || name,
      avatarUrl: dbUser.avatarUrl || avatarUrl,
      isDemo: false,
      plan: isSubscriptionActive(subscription) ? "PRO" : "FREE",
      currentRole: profile.currentRole,
      experienceLevel: profile.experienceLevel,
      preferences: mergePreferences(profile.preferences),
    }
  } catch (error) {
    console.error("Failed to sync authenticated user:", error)
    return {
      authId: user.id,
      dbUserId: null,
      email,
      name,
      avatarUrl,
      isDemo: false,
      plan: "FREE",
      preferences: demoPreferences,
    }
  }
}
