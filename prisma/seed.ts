import { PrismaClient, PlanType, OfferStatus, AuditAction } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Clean up existing data (optional, but good for local dev)
  await prisma.auditLog.deleteMany()
  await prisma.usageRecord.deleteMany()
  await prisma.chatMessage.deleteMany()
  await prisma.chatSession.deleteMany()
  await prisma.comparisonOffer.deleteMany()
  await prisma.comparison.deleteMany()
  await prisma.offerDocument.deleteMany()
  await prisma.compensation.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  // Create a dummy user
  const user = await prisma.user.create({
    data: {
      email: 'demo@offerpilot.ai',
      name: 'Demo User',
      authId: 'mock-auth-id-12345',
      profile: {
        create: {
          currentRole: 'Software Engineer',
          experienceLevel: 'Mid-Level',
          preferences: { location: 'Remote' },
        },
      },
      subscription: {
        create: {
          plan: PlanType.PRO,
        },
      },
    },
  })

  // Create a dummy offer
  const offer = await prisma.offer.create({
    data: {
      userId: user.id,
      companyName: 'TechCorp Inc.',
      jobTitle: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      status: OfferStatus.PENDING,
      compensation: {
        create: {
          baseSalary: 150000,
          currency: 'USD',
          bonus: 15000,
          equity: 50000,
          equityType: 'RSU',
          signOnBonus: 10000,
          ptoDays: 21,
          benefits: { health: true, dental: true, vision: true, match401k: '4%' },
        },
      },
    },
  })

  // Create an audit log for the offer creation
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: AuditAction.OFFER_CREATED,
      details: { offerId: offer.id, companyName: offer.companyName },
    },
  })

  console.log(`Seeded user: ${user.email} with 1 offer.`)
  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
