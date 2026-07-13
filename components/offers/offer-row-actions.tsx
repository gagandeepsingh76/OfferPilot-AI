"use client"

import { useState } from "react"
import Link from "next/link"
import { Archive, Loader2, MoreHorizontal, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { archiveOffer, deleteOffer } from "@/server/actions/offers"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function OfferRowActions({ offerId }: { offerId: string }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function runAction(action: "archive" | "delete") {
    setIsPending(true)

    try {
      const result = action === "archive" ? await archiveOffer(offerId) : await deleteOffer(offerId)

      if (!result.success) {
        toast.error(result.error || "We could not update this offer.")
        return
      }

      toast.success(action === "archive" ? "Offer archived" : "Offer deleted")
      router.refresh()
    } catch {
      toast.error("We could not update this offer. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-md transition-colors" disabled={isPending}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem render={<Link href={`/dashboard/offers/${offerId}`} />}>
          Edit Offer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => runAction("archive")} className="text-yellow-600 focus:text-yellow-600 cursor-pointer">
          <Archive className="mr-2 h-4 w-4" /> Archive
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => runAction("delete")} className="text-destructive focus:text-destructive cursor-pointer">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
