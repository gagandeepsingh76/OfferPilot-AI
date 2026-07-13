"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { Prisma } from "@prisma/client"

import { getCurrentAppUser, mergePreferences } from "@/lib/current-user"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  avatarUrl: z.string().url("Enter a valid avatar URL").or(z.literal("")),
  currentRole: z.string().max(120).optional(),
  experienceLevel: z.string().max(80).optional(),
})

const PreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  defaultCurrency: z.string().min(3).max(3),
  shareAnonymizedBenchmarks: z.boolean(),
})

const NotificationsSchema = z.object({
  offerInsights: z.boolean(),
  productUpdates: z.boolean(),
  billingAlerts: z.boolean(),
  securityAlerts: z.boolean(),
})

const PasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords must match",
})

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on"
}

async function requireDbUser() {
  const user = await getCurrentAppUser()
  if (!user) return { success: false as const, error: "Please sign in to continue." }
  if (!user.dbUserId) return { success: false as const, error: "Your account is still being prepared. Please refresh and try again." }
  return { success: true as const, user }
}

export async function updateProfileSettings(formData: FormData) {
  const parsed = ProfileSchema.safeParse({
    name: formData.get("name"),
    avatarUrl: formData.get("avatarUrl") || "",
    currentRole: formData.get("currentRole") || "",
    experienceLevel: formData.get("experienceLevel") || "",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Please check your profile details." }
  }

  const userResult = await requireDbUser()
  if (!userResult.success) return userResult

  if (userResult.user.isDemo) {
    return { success: true, message: "Demo profile changes are temporary and reset automatically." }
  }

  try {
    await prisma.user.update({
      where: { id: userResult.user.dbUserId! },
      data: {
        name: parsed.data.name,
        avatarUrl: parsed.data.avatarUrl || null,
      },
    })

    await prisma.profile.upsert({
      where: { userId: userResult.user.dbUserId! },
      update: {
        currentRole: parsed.data.currentRole || null,
        experienceLevel: parsed.data.experienceLevel || null,
      },
      create: {
        userId: userResult.user.dbUserId!,
        currentRole: parsed.data.currentRole || null,
        experienceLevel: parsed.data.experienceLevel || null,
      },
    })

    if (!userResult.user.isDemo) {
      const supabase = await createClient()
      await supabase.auth.updateUser({
        data: {
          full_name: parsed.data.name,
          name: parsed.data.name,
          avatar_url: parsed.data.avatarUrl || null,
        },
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update profile settings:", error)
    return { success: false, error: "We could not update your profile. Please try again." }
  }
}

export async function updatePreferenceSettings(formData: FormData) {
  const parsed = PreferencesSchema.safeParse({
    theme: formData.get("theme"),
    defaultCurrency: formData.get("defaultCurrency"),
    shareAnonymizedBenchmarks: checked(formData, "shareAnonymizedBenchmarks"),
  })

  if (!parsed.success) {
    return { success: false, error: "Please check your preference settings." }
  }

  const userResult = await requireDbUser()
  if (!userResult.success) return userResult

  if (userResult.user.isDemo) {
    return { success: true, message: "Demo preferences are temporary and reset automatically." }
  }

  try {
    const currentProfile = await prisma.profile.findUnique({ where: { userId: userResult.user.dbUserId! } })
    const currentPreferences = mergePreferences(currentProfile?.preferences)
    const preferences = {
      ...currentPreferences,
      theme: parsed.data.theme,
      defaultCurrency: parsed.data.defaultCurrency,
      privacy: {
        ...currentPreferences.privacy,
        shareAnonymizedBenchmarks: parsed.data.shareAnonymizedBenchmarks,
      },
    }

    await prisma.profile.upsert({
      where: { userId: userResult.user.dbUserId! },
      update: { preferences: preferences as Prisma.InputJsonValue },
      create: {
        userId: userResult.user.dbUserId!,
        preferences: preferences as Prisma.InputJsonValue,
      },
    })

    revalidatePath("/dashboard/settings/preferences")
    return { success: true }
  } catch (error) {
    console.error("Failed to update preferences:", error)
    return { success: false, error: "We could not save your preferences. Please try again." }
  }
}

export async function updateNotificationSettings(formData: FormData) {
  const parsed = NotificationsSchema.safeParse({
    offerInsights: checked(formData, "offerInsights"),
    productUpdates: checked(formData, "productUpdates"),
    billingAlerts: checked(formData, "billingAlerts"),
    securityAlerts: checked(formData, "securityAlerts"),
  })

  if (!parsed.success) {
    return { success: false, error: "Please check your notification settings." }
  }

  const userResult = await requireDbUser()
  if (!userResult.success) return userResult

  if (userResult.user.isDemo) {
    return { success: true, message: "Demo notification settings are temporary and reset automatically." }
  }

  try {
    const currentProfile = await prisma.profile.findUnique({ where: { userId: userResult.user.dbUserId! } })
    const currentPreferences = mergePreferences(currentProfile?.preferences)
    const preferences = {
      ...currentPreferences,
      notifications: parsed.data,
    }

    await prisma.profile.upsert({
      where: { userId: userResult.user.dbUserId! },
      update: { preferences: preferences as Prisma.InputJsonValue },
      create: {
        userId: userResult.user.dbUserId!,
        preferences: preferences as Prisma.InputJsonValue,
      },
    })

    revalidatePath("/dashboard/settings/notifications")
    return { success: true }
  } catch (error) {
    console.error("Failed to update notifications:", error)
    return { success: false, error: "We could not save notification settings. Please try again." }
  }
}

export async function updatePasswordSettings(formData: FormData) {
  const parsed = PasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Please check your password." }
  }

  const userResult = await requireDbUser()
  if (!userResult.success) return userResult

  if (userResult.user.isDemo) {
    return { success: true, message: "Demo passwords are reset automatically between sessions." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) {
    return { success: false, error: error.message || "We could not update your password." }
  }

  return { success: true }
}
