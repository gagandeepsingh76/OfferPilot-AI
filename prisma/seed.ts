import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const demoUserId = 'demo-user-id'

  // Upsert User
  const user = await prisma.user.upsert({
    where: { email: 'demo@offerpilot.ai' },
    update: { authId: demoUserId },
    create: {
      id: demoUserId,
      authId: demoUserId,
      email: 'demo@offerpilot.ai',
    },
  })

  // Upsert Profile
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      currentRole: 'Senior Software Engineer',
      experienceLevel: '5+ years',
    },
  })

  // Upsert Subscription
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { plan: 'PRO' },
    create: {
      userId: user.id,
      plan: 'PRO',
      stripeCustomerId: 'cus_demo123',
    },
  })

  // Upsert Offers
  const offersData = [
    {
      id: 'demo-offer-1',
      companyName: 'Google',
      jobTitle: 'L5 Software Engineer',
      location: 'Mountain View, CA',
      status: 'PENDING',
      comp: {
        baseSalary: 210000,
        currency: 'USD',
        signOnBonus: 50000,
        bonus: 31500,
        equity: 600000,
        equityType: 'RSU',
        ptoDays: 20,
        benefits: {
          healthInsurance: true,
          dentalInsurance: true,
          visionInsurance: true,
          retirementPlan: true,
          relocation: true,
        },
      }
    },
    {
      id: 'demo-offer-2',
      companyName: 'Meta',
      jobTitle: 'E5 Software Engineer',
      location: 'Menlo Park, CA',
      status: 'PENDING',
      comp: {
        baseSalary: 220000,
        currency: 'USD',
        signOnBonus: 75000,
        bonus: 33000,
        equity: 550000,
        equityType: 'RSU',
        ptoDays: 21,
        benefits: {
          healthInsurance: true,
          dentalInsurance: true,
          visionInsurance: true,
          retirementPlan: true,
        },
      }
    },
    {
      id: 'demo-offer-3',
      companyName: 'Stripe',
      jobTitle: 'L3 Software Engineer',
      location: 'Remote',
      status: 'PENDING',
      comp: {
        baseSalary: 230000,
        currency: 'USD',
        signOnBonus: 0,
        bonus: 0,
        equity: 400000,
        equityType: 'Options',
        ptoDays: 25,
        benefits: {
          healthInsurance: true,
          dentalInsurance: true,
          wfhAllowance: true,
          learningBudget: true,
        },
      }
    },
    {
      id: 'demo-offer-4',
      companyName: 'Netflix',
      jobTitle: 'Senior Software Engineer',
      location: 'Los Gatos, CA',
      status: 'REJECTED',
      comp: {
        baseSalary: 450000,
        currency: 'USD',
        signOnBonus: 0,
        bonus: 0,
        equity: 0,
        equityType: 'None',
        ptoDays: 30,
        benefits: {
          healthInsurance: true,
          dentalInsurance: true,
          wfhAllowance: false,
          learningBudget: false,
        },
      }
    },
    {
      id: 'demo-offer-5',
      companyName: 'Apple',
      jobTitle: 'ICT4 Software Engineer',
      location: 'Cupertino, CA',
      status: 'ACCEPTED',
      comp: {
        baseSalary: 190000,
        currency: 'USD',
        signOnBonus: 40000,
        bonus: 28500,
        equity: 350000,
        equityType: 'RSU',
        ptoDays: 18,
        benefits: {
          healthInsurance: true,
          dentalInsurance: true,
          visionInsurance: true,
          retirementPlan: true,
        },
      }
    }
  ]

  for (const offer of offersData) {
    const o = await prisma.offer.upsert({
      where: { id: offer.id },
      update: {},
      create: {
        id: offer.id,
        userId: user.id,
        companyName: offer.companyName,
        jobTitle: offer.jobTitle,
        location: offer.location,
        status: offer.status as 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ARCHIVED',
      },
    })
    
    await prisma.compensation.upsert({
      where: { offerId: o.id },
      update: {},
      create: {
        offerId: o.id,
        ...offer.comp,
      },
    })
  }

  // Seed Chat Sessions
  await prisma.chatSession.upsert({
    where: { id: 'demo-chat-1' },
    update: {},
    create: {
      id: 'demo-chat-1',
      userId: user.id,
      offerId: 'demo-offer-1',
      messages: {
        create: [
          { role: 'user', content: 'What are the main weaknesses of this offer?' },
          { role: 'assistant', content: 'While the base salary and equity are very strong for an L5 position, the target bonus is relatively standard. Additionally, the PTO policy is average. You might have room to negotiate the sign-on bonus higher.' }
        ]
      }
    }
  })

  console.log('Seeding complete for demo user.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
