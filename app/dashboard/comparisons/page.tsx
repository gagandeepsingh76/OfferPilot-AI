import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { ComparisonView } from "./comparison-view"

async function getOffers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const prismaUser = await prisma.user.findUnique({ where: { authId: user.id } })
  if (!prismaUser) return []

  return await prisma.offer.findMany({
    where: { userId: prismaUser.id },
    include: { compensation: true },
    orderBy: { createdAt: "desc" },
  })
}

export default async function ComparisonsPage() {
  const offers = await getOffers()

  return (
    <div className="max-w-5xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compare Offers</h1>
        <p className="text-muted-foreground mt-1">Select multiple offers to generate an AI-powered comparison and recommendation.</p>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ComparisonView offers={offers as any} />
    </div>
  )
}
