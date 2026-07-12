import Link from "next/link"
import { Plus, Building2, MapPin, MoreHorizontal, FileText, Trash2, Archive } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { buttonVariants } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export default async function OffersPage() {
  const offers = await getOffers()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground mt-1">Manage and track your job offers.</p>
        </div>
        <Link href="/dashboard/offers/new" className={buttonVariants({ className: "gap-2" })}>
          <Plus className="h-4 w-4" /> New Offer
        </Link>
      </div>

      {offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-xl bg-card">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No offers yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Upload your first job offer to get AI-powered negotiation advice and compensation analysis.
          </p>
          <Link href="/dashboard/offers/new" className={buttonVariants({ variant: "outline" })}>
            Add an offer
          </Link>
        </div>
      ) : (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Company & Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Base Salary</th>
                  <th className="px-6 py-4 font-medium">Total Comp</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {offers.map((offer) => {
                  const base = offer.compensation?.baseSalary || 0
                  const bonus = offer.compensation?.bonus || 0
                  const equity = offer.compensation?.equity || 0
                  const signOn = offer.compensation?.signOnBonus || 0
                  const total = base + bonus + equity + signOn

                  const formatCurrency = (amount: number) => 
                    new Intl.NumberFormat("en-US", { style: "currency", currency: offer.compensation?.currency || "USD", maximumFractionDigits: 0 }).format(amount)

                  return (
                    <tr key={offer.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/dashboard/offers/${offer.id}`}>
                            {offer.companyName}
                          </Link>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {offer.jobTitle}</span>
                          {offer.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {offer.location}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          offer.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          offer.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          offer.status === 'ARCHIVED' ? 'bg-gray-500/10 text-gray-500 border-gray-500/20' :
                          'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(base)}
                      </td>
                      <td className="px-6 py-4 font-medium text-primary">
                        {formatCurrency(total)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-md transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem render={<Link href={`/dashboard/offers/${offer.id}`} className="cursor-pointer" />}>
                              Edit Offer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-yellow-600 focus:text-yellow-600 cursor-pointer">
                              <Archive className="mr-2 h-4 w-4" /> Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
