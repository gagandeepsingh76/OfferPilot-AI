import { Prisma } from "@prisma/client"
import { getCurrentAppUser } from "@/lib/current-user"
import { getDemoOfferById, getDemoOffers } from "@/lib/demo-data"
import { prisma } from "@/lib/prisma"

export type OfferWithCompensation = Prisma.OfferGetPayload<{
  include: { compensation: true; documents: true }
}>

export async function getOffersForCurrentUser() {
  const user = await getCurrentAppUser()
  if (!user) return { user: null, offers: [] as OfferWithCompensation[], error: null }

  try {
    if (!user.dbUserId) {
      throw new Error("Database user is not available")
    }

    const offers = await prisma.offer.findMany({
      where: { userId: user.dbUserId },
      include: { compensation: true, documents: true },
      orderBy: { createdAt: "desc" },
    })

    return { user, offers, error: null }
  } catch (error) {
    console.error("Failed to load offers:", error)

    if (user.isDemo) {
      return {
        user,
        offers: getDemoOffers() as unknown as OfferWithCompensation[],
        error: null,
      }
    }

    return {
      user,
      offers: [] as OfferWithCompensation[],
      error: "We could not load your offers right now. Please try again in a moment.",
    }
  }
}

export async function getOfferForCurrentUser(id: string) {
  const user = await getCurrentAppUser()
  if (!user) return { user: null, offer: null, error: null }

  try {
    if (!user.dbUserId) {
      throw new Error("Database user is not available")
    }

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { compensation: true, documents: true },
    })

    if (!offer || offer.userId !== user.dbUserId) {
      return { user, offer: null, error: null }
    }

    return { user, offer, error: null }
  } catch (error) {
    console.error("Failed to load offer:", error)

    if (user.isDemo) {
      return {
        user,
        offer: getDemoOfferById(id) as unknown as OfferWithCompensation | null,
        error: null,
      }
    }

    return {
      user,
      offer: null,
      error: "We could not load that offer right now. Please try again in a moment.",
    }
  }
}
