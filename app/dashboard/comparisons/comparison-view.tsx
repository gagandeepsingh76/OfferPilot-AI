"use client"

import * as React from "react"
import { Loader2, Sparkles, CheckSquare, Square } from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import type { OfferWithCompensation } from "@/lib/offers-data"

export function ComparisonView({ offers }: { offers: OfferWithCompensation[] }) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [completion, setCompletion] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const formatNumber = React.useMemo(
    () => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }),
    []
  )

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      toast.error("Please select at least 2 offers to compare.")
      return
    }

    setIsLoading(true)
    setError("")
    setCompletion("")

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerIds: selectedIds }),
      })

      const text = await response.text()
      if (!response.ok) {
        throw new Error(text || "Failed to generate comparison")
      }

      setCompletion(text)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate comparison"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (offers.length < 2) {
    return (
      <div className="flex-1 border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center p-8 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Not enough offers</h2>
        <p className="text-muted-foreground max-w-md">
          You need at least 2 offers to generate a comparison. Add more offers to unlock AI-powered insights.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
      {/* Selection Panel */}
      <div className="w-full md:w-80 flex flex-col gap-4 bg-card border border-border rounded-xl p-4 overflow-y-auto shrink-0 shadow-sm">
        <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Select Offers</h3>
        <div className="flex flex-col gap-2">
          {offers.map(offer => {
            const isSelected = selectedIds.includes(offer.id)
            return (
              <button
                key={offer.id}
                onClick={() => toggleSelect(offer.id)}
                className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all ${
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="mt-0.5 text-primary shrink-0">
                  {isSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div>
                  <div className="font-medium text-sm">{offer.companyName}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{offer.jobTitle}</div>
                  <div className="text-xs font-medium mt-1">
                    {offer.compensation?.currency} {formatNumber.format(offer.compensation?.baseSalary || 0)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        <div className="mt-auto pt-4 border-t border-border">
          <button
            onClick={handleCompare}
            disabled={selectedIds.length < 2 || isLoading}
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isLoading ? "Analyzing..." : "Compare Selected"}
          </button>
          {error && <p className="text-xs text-destructive mt-2 text-center">{error}</p>}
        </div>
      </div>

      {/* Results Panel */}
      <div className="flex-1 bg-card border border-border rounded-xl p-6 overflow-y-auto shadow-sm">
        {!completion && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm text-center">
            <Sparkles className="h-8 w-8 mb-4 opacity-20" />
            <p>Select at least 2 offers and click compare to see the AI breakdown.</p>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{completion}</ReactMarkdown>
            {isLoading && (
              <div className="flex items-center gap-2 mt-4 text-muted-foreground text-sm animate-pulse">
                <Sparkles className="h-4 w-4" /> Generating insights...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
