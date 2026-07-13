import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export const DEMO_AUTH_ID = "demo-user-id"
export const DEMO_EMAIL = "demo@offerpilot.ai"

export const demoUser = {
  id: DEMO_AUTH_ID,
  authId: DEMO_AUTH_ID,
  email: DEMO_EMAIL,
  name: "Demo User",
  avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Demo%20User",
}

export const demoPreferences = {
  theme: "system",
  defaultCurrency: "USD",
  notifications: {
    offerInsights: true,
    productUpdates: true,
    billingAlerts: true,
    securityAlerts: true,
  },
  privacy: {
    shareAnonymizedBenchmarks: false,
  },
}

export const demoOffers = [
  {
    id: "demo-offer-1",
    companyName: "Google",
    jobTitle: "L5 Software Engineer",
    location: "Mountain View, CA",
    status: "PENDING" as const,
    notes: "Strong brand and learning environment. Good relocation support.",
    compensation: {
      baseSalary: 210000,
      currency: "USD",
      signOnBonus: 50000,
      bonus: 31500,
      equity: 600000,
      equityType: "RSU",
      ptoDays: 20,
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        visionInsurance: true,
        retirementPlan: true,
        relocation: true,
        learningBudget: true,
        wfhAllowance: false,
        flexibleHours: true,
        other: "Onsite meals, commuter support",
      },
    },
  },
  {
    id: "demo-offer-2",
    companyName: "Meta",
    jobTitle: "E5 Software Engineer",
    location: "Menlo Park, CA",
    status: "PENDING" as const,
    notes: "Best first-year cash. Clarify refreshers and team stability.",
    compensation: {
      baseSalary: 220000,
      currency: "USD",
      signOnBonus: 75000,
      bonus: 33000,
      equity: 550000,
      equityType: "RSU",
      ptoDays: 21,
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        visionInsurance: true,
        retirementPlan: true,
        relocation: true,
        learningBudget: false,
        wfhAllowance: true,
        flexibleHours: true,
        other: "Wellness stipend",
      },
    },
  },
  {
    id: "demo-offer-3",
    companyName: "Stripe",
    jobTitle: "L3 Software Engineer",
    location: "Remote",
    status: "PENDING" as const,
    notes: "Remote-first role with strong upside. Options need liquidity review.",
    compensation: {
      baseSalary: 230000,
      currency: "USD",
      signOnBonus: 20000,
      bonus: 0,
      equity: 400000,
      equityType: "Options",
      ptoDays: 25,
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        visionInsurance: true,
        retirementPlan: true,
        relocation: false,
        learningBudget: true,
        wfhAllowance: true,
        flexibleHours: true,
        other: "Home office budget",
      },
    },
  },
  {
    id: "demo-offer-4",
    companyName: "Netflix",
    jobTitle: "Senior Software Engineer",
    location: "Los Gatos, CA",
    status: "REJECTED" as const,
    notes: "Excellent cash, less equity leverage for long-term upside.",
    compensation: {
      baseSalary: 450000,
      currency: "USD",
      signOnBonus: 0,
      bonus: 0,
      equity: 0,
      equityType: "None",
      ptoDays: 30,
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        visionInsurance: true,
        retirementPlan: true,
        relocation: true,
        learningBudget: false,
        wfhAllowance: false,
        flexibleHours: true,
        other: "Flexible vacation",
      },
    },
  },
  {
    id: "demo-offer-5",
    companyName: "Apple",
    jobTitle: "ICT4 Software Engineer",
    location: "Cupertino, CA",
    status: "ACCEPTED" as const,
    notes: "Balanced package with strong brand value and predictable vesting.",
    compensation: {
      baseSalary: 190000,
      currency: "USD",
      signOnBonus: 40000,
      bonus: 28500,
      equity: 350000,
      equityType: "RSU",
      ptoDays: 18,
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        visionInsurance: true,
        retirementPlan: true,
        relocation: true,
        learningBudget: true,
        wfhAllowance: false,
        flexibleHours: false,
        other: "Employee stock purchase plan",
      },
    },
  },
]

export function getDemoOfferById(id: string) {
  return getDemoOffers().find((offer) => offer.id === id) ?? null
}

export function getDemoOffers() {
  const now = new Date("2026-07-13T00:00:00.000Z")

  return demoOffers.map((offer) => ({
    ...offer,
    userId: DEMO_AUTH_ID,
    createdAt: now,
    updatedAt: now,
    compensation: {
      id: `${offer.id}-compensation`,
      offerId: offer.id,
      createdAt: now,
      updatedAt: now,
      ...offer.compensation,
    },
    documents: [],
  }))
}

export async function ensureDemoAccount() {
  const user = await prisma.user.upsert({
    where: { authId: DEMO_AUTH_ID },
    update: {
      email: demoUser.email,
      name: demoUser.name,
      avatarUrl: demoUser.avatarUrl,
    },
    create: {
      id: DEMO_AUTH_ID,
      authId: DEMO_AUTH_ID,
      email: demoUser.email,
      name: demoUser.name,
      avatarUrl: demoUser.avatarUrl,
    },
  })

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      currentRole: "Senior Software Engineer",
      experienceLevel: "5+ years",
      preferences: demoPreferences as Prisma.InputJsonValue,
    },
    create: {
      userId: user.id,
      currentRole: "Senior Software Engineer",
      experienceLevel: "5+ years",
      preferences: demoPreferences as Prisma.InputJsonValue,
    },
  })

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { plan: "PRO" },
    create: {
      userId: user.id,
      plan: "PRO",
      stripeCustomerId: "cus_demo_offerpilot",
    },
  })

  for (const offer of demoOffers) {
    const dbOffer = await prisma.offer.upsert({
      where: { id: offer.id },
      update: {
        userId: user.id,
        companyName: offer.companyName,
        jobTitle: offer.jobTitle,
        location: offer.location,
        status: offer.status,
        notes: offer.notes,
      },
      create: {
        id: offer.id,
        userId: user.id,
        companyName: offer.companyName,
        jobTitle: offer.jobTitle,
        location: offer.location,
        status: offer.status,
        notes: offer.notes,
      },
    })

    await prisma.compensation.upsert({
      where: { offerId: dbOffer.id },
      update: {
        ...offer.compensation,
        benefits: offer.compensation.benefits as Prisma.InputJsonValue,
      },
      create: {
        offerId: dbOffer.id,
        ...offer.compensation,
        benefits: offer.compensation.benefits as Prisma.InputJsonValue,
      },
    })
  }

  await prisma.chatSession.upsert({
    where: { id: "demo-chat-1" },
    update: {},
    create: {
      id: "demo-chat-1",
      userId: user.id,
      offerId: "demo-offer-1",
      title: "Google negotiation review",
      messages: {
        create: [
          {
            role: "user",
            content: "What are the main weaknesses of this offer?",
          },
          {
            role: "assistant",
            content:
              "The package is strong, but the sign-on bonus and annual bonus are the best negotiation targets. Ask whether equity refreshers are standardized and whether relocation can be increased.",
          },
        ],
      },
    },
  })

  return user
}
