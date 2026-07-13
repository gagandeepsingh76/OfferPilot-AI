"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { OfferFormValues } from "@/lib/validations/offer"
import { Prisma } from "@prisma/client"
import { getCurrentAppUser } from "@/lib/current-user"
import { DEMO_AUTH_ID } from "@/lib/demo-data"

async function getPrismaUser() {
  const appUser = await getCurrentAppUser()
  if (!appUser) return { success: false as const, error: "Please sign in to continue." }
  if (!appUser.dbUserId) return { success: false as const, error: "Your account is still being prepared. Please refresh and try again." }
  if (appUser.isDemo) {
    return {
      success: true as const,
      isDemo: true as const,
      user: {
        id: DEMO_AUTH_ID,
        email: appUser.email,
        name: appUser.name,
        avatarUrl: appUser.avatarUrl,
      },
    }
  }

  const prismaUser = await prisma.user.findUnique({ where: { id: appUser.dbUserId } })
  if (!prismaUser) return { success: false as const, error: "Your account profile could not be found." }
  
  return { success: true as const, isDemo: false as const, user: prismaUser }
}

export async function createOffer(data: OfferFormValues) {
  try {
    const userResult = await getPrismaUser()
    if (!userResult.success) return { success: false, error: userResult.error }
    const user = userResult.user

    if (userResult.isDemo) {
      return {
        success: true,
        data: {
          id: `demo-offer-${Date.now()}`,
          userId: user.id,
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          location: data.location ?? null,
          status: data.status as "PENDING" | "ACCEPTED" | "REJECTED" | "ARCHIVED",
          notes: data.notes ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }
    }

    const { checkFeatureLimit } = await import("@/lib/ai-usage")
    const canCreate = await checkFeatureLimit(user.id, "OFFERS")
    if (!canCreate) {
      return { success: false, error: "LIMIT_REACHED" }
    }
    
    const offer = await prisma.offer.create({
      data: {
        userId: user.id,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        location: data.location,
        status: data.status as "PENDING" | "ACCEPTED" | "REJECTED" | "ARCHIVED",
        notes: data.notes,
        compensation: {
          create: {
            baseSalary: data.baseSalary,
            currency: data.currency,
            bonus: data.bonus,
            equity: data.equity,
            equityType: data.equityType,
            signOnBonus: data.signOnBonus,
            ptoDays: data.ptoDays,
            benefits: data.benefits as unknown as Prisma.InputJsonValue,
          }
        }
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "OFFER_CREATED",
        details: { offerId: offer.id }
      }
    })

    revalidatePath("/dashboard/offers")
    revalidatePath("/dashboard")
    return { success: true, data: offer }
  } catch (error) {
    console.error("Failed to create offer:", error)
    return { success: false, error: "We could not create that offer. Please try again." }
  }
}

export async function updateOffer(id: string, data: OfferFormValues) {
  try {
    const userResult = await getPrismaUser()
    if (!userResult.success) return { success: false, error: userResult.error }
    const user = userResult.user

    if (userResult.isDemo) {
      revalidatePath(`/dashboard/offers/${id}`)
      revalidatePath("/dashboard/offers")
      return { success: true, data: { id } }
    }
    
    // Verify ownership
    const existing = await prisma.offer.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.id) throw new Error("Not found or unauthorized")

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        location: data.location,
        status: data.status as "PENDING" | "ACCEPTED" | "REJECTED" | "ARCHIVED",
        notes: data.notes,
        compensation: {
          upsert: {
            create: {
              baseSalary: data.baseSalary,
              currency: data.currency,
              bonus: data.bonus,
              equity: data.equity,
              equityType: data.equityType,
              signOnBonus: data.signOnBonus,
              ptoDays: data.ptoDays,
              benefits: data.benefits as unknown as Prisma.InputJsonValue,
            },
            update: {
            baseSalary: data.baseSalary,
            currency: data.currency,
            bonus: data.bonus,
            equity: data.equity,
            equityType: data.equityType,
            signOnBonus: data.signOnBonus,
            ptoDays: data.ptoDays,
            benefits: data.benefits as unknown as Prisma.InputJsonValue,
            },
          }
        }
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "OFFER_UPDATED",
        details: { offerId: offer.id }
      }
    })

    revalidatePath(`/dashboard/offers/${id}`)
    revalidatePath("/dashboard/offers")
    return { success: true, data: offer }
  } catch (error) {
    console.error("Failed to update offer:", error)
    return { success: false, error: "We could not update that offer. Please try again." }
  }
}

export async function deleteOffer(id: string) {
  try {
    const userResult = await getPrismaUser()
    if (!userResult.success) return { success: false, error: userResult.error }
    const user = userResult.user

    if (userResult.isDemo) {
      revalidatePath("/dashboard/offers")
      revalidatePath("/dashboard")
      return { success: true }
    }
    
    const existing = await prisma.offer.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.id) throw new Error("Not found or unauthorized")

    await prisma.offer.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "OFFER_DELETED",
        details: { offerId: id }
      }
    })

    revalidatePath("/dashboard/offers")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete offer:", error)
    return { success: false, error: "We could not delete that offer. Please try again." }
  }
}

export async function archiveOffer(id: string) {
  try {
    const userResult = await getPrismaUser()
    if (!userResult.success) return { success: false, error: userResult.error }
    const user = userResult.user

    if (userResult.isDemo) {
      revalidatePath(`/dashboard/offers/${id}`)
      revalidatePath("/dashboard/offers")
      return { success: true }
    }
    
    const existing = await prisma.offer.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.id) throw new Error("Not found or unauthorized")

    await prisma.offer.update({
      where: { id },
      data: { status: "ARCHIVED" }
    })

    revalidatePath(`/dashboard/offers/${id}`)
    revalidatePath("/dashboard/offers")
    return { success: true }
  } catch (error) {
    console.error("Failed to archive offer:", error)
    return { success: false, error: "We could not archive that offer. Please try again." }
  }
}

export async function saveOfferDocument(offerId: string, fileName: string, fileUrl: string, fileType: string, fileSize: number) {
  try {
    const userResult = await getPrismaUser()
    if (!userResult.success) return { success: false, error: userResult.error }
    const user = userResult.user

    if (userResult.isDemo) {
      revalidatePath(`/dashboard/offers/${offerId}`)
      return {
        success: true,
        data: {
          id: `demo-document-${Date.now()}`,
          offerId,
          fileName,
          fileUrl,
          fileType,
          fileSize,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }
    }
    
    const existing = await prisma.offer.findUnique({ where: { id: offerId } })
    if (!existing || existing.userId !== user.id) throw new Error("Not found or unauthorized")

    const { checkFeatureLimit } = await import("@/lib/ai-usage")
    const canUpload = await checkFeatureLimit(user.id, "PDF_UPLOAD")
    if (!canUpload) {
      return { success: false, error: "LIMIT_REACHED" }
    }

    const document = await prisma.offerDocument.create({
      data: {
        offerId,
        fileName,
        fileUrl,
        fileType,
        fileSize
      }
    })

    revalidatePath(`/dashboard/offers/${offerId}`)
    return { success: true, data: document }
  } catch (error) {
    console.error("Failed to save document:", error)
    return { success: false, error: "We could not save that document. Please try again." }
  }
}
