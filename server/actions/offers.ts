"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { OfferFormValues } from "@/lib/validations/offer"
import { Prisma } from "@prisma/client"

async function getPrismaUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error("Unauthorized")

  const prismaUser = await prisma.user.findUnique({
    where: { authId: user.id },
  })

  if (!prismaUser) throw new Error("User not found in database")
  
  return prismaUser
}

export async function createOffer(data: OfferFormValues) {
  try {
    const user = await getPrismaUser()
    
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
    return { success: false, error: "Failed to create offer" }
  }
}

export async function updateOffer(id: string, data: OfferFormValues) {
  try {
    const user = await getPrismaUser()
    
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
          update: {
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
        action: "OFFER_UPDATED",
        details: { offerId: offer.id }
      }
    })

    revalidatePath(`/dashboard/offers/${id}`)
    revalidatePath("/dashboard/offers")
    return { success: true, data: offer }
  } catch (error) {
    console.error("Failed to update offer:", error)
    return { success: false, error: "Failed to update offer" }
  }
}

export async function deleteOffer(id: string) {
  try {
    const user = await getPrismaUser()
    
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
    return { success: false, error: "Failed to delete offer" }
  }
}

export async function archiveOffer(id: string) {
  try {
    const user = await getPrismaUser()
    
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
    return { success: false, error: "Failed to archive offer" }
  }
}

export async function saveOfferDocument(offerId: string, fileName: string, fileUrl: string, fileType: string, fileSize: number) {
  try {
    const user = await getPrismaUser()
    
    const existing = await prisma.offer.findUnique({ where: { id: offerId } })
    if (!existing || existing.userId !== user.id) throw new Error("Not found or unauthorized")

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
    return { success: false, error: "Failed to save document" }
  }
}
