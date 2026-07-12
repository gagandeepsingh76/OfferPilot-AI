"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Loader2, UploadCloud } from "lucide-react"
import { toast } from "sonner"

import { OfferFormSchema, OfferFormValues } from "@/lib/validations/offer"
import { createOffer, updateOffer, saveOfferDocument } from "@/server/actions/offers"
import { createClient } from "@/lib/supabase/client"
import { Sparkles } from "lucide-react"

interface OfferFormProps {
  initialData?: OfferFormValues & { id: string }
}

export function OfferForm({ initialData }: OfferFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [isExtracting, setIsExtracting] = React.useState(false)
  
  const form = useForm<OfferFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(OfferFormSchema) as any,
    defaultValues: initialData || {
      status: "PENDING",
      currency: "USD",
      benefits: {
        healthInsurance: false,
        dentalInsurance: false,
        visionInsurance: false,
        retirementPlan: false,
        relocation: false,
        learningBudget: false,
        wfhAllowance: false,
        flexibleHours: false,
        other: "",
      }
    }
  })

  async function onSubmit(data: OfferFormValues) {
    setIsPending(true)
    try {
      let offerId = initialData?.id

      if (offerId) {
        const res = await updateOffer(offerId, data)
        if (!res.success) throw new Error(res.error)
      } else {
        const res = await createOffer(data)
        if (!res.success || !res.data) throw new Error(res.error)
        offerId = res.data.id
      }

      // Handle File Upload
      if (file && offerId) {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        const userId = userData.user?.id
        
        if (userId) {
          // eslint-disable-next-line react-hooks/purity
          const timestamp = Date.now()
          const filePath = `${userId}/${offerId}/${timestamp}_${file.name}`
          const { error: uploadError } = await supabase.storage
            .from("offer-documents")
            .upload(filePath, file)
            
          if (uploadError) {
            console.error("Upload error:", uploadError)
            toast.error("Offer saved, but failed to upload document.")
          } else {
            const { data: publicUrlData } = supabase.storage
              .from("offer-documents")
              .getPublicUrl(filePath)
              
            await saveOfferDocument(
              offerId,
              file.name,
              publicUrlData.publicUrl,
              file.type,
              file.size
            )
          }
        }
      }

      toast.success(initialData ? "Offer updated successfully" : "Offer created successfully")
      router.push("/dashboard/offers")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsPending(false)
    }
  }

  async function handleAiExtract() {
    if (!file) return
    setIsExtracting(true)
    
    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      
      if (!userId) throw new Error("Unauthorized")

      // Upload temporarily for extraction
      const filePath = `${userId}/temp/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from("offer-documents")
        .upload(filePath, file)

      if (uploadError) throw new Error("Failed to upload document for analysis")

      const { data: publicUrlData } = supabase.storage
        .from("offer-documents")
        .getPublicUrl(filePath)

      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: publicUrlData.publicUrl })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze document")
      }

      if (result.data) {
        const d = result.data
        form.reset({
          ...form.getValues(),
          companyName: d.companyName || "",
          jobTitle: d.jobTitle || "",
          location: d.location || "",
          baseSalary: d.baseSalary || 0,
          currency: d.currency || "USD",
          signOnBonus: d.signOnBonus || 0,
          bonus: d.bonus || 0,
          equity: d.equity || 0,
          equityType: d.equityType || "",
          ptoDays: d.ptoDays || 0,
          benefits: {
            ...form.getValues().benefits,
            ...d.benefits
          }
        })
        toast.success(`Extracted data with ${d.confidenceScore}% confidence. Please review before saving.`)
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to analyze document")
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Details</h3>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Company Name</label>
            <input 
              {...form.register("companyName")} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. Acme Corp" 
            />
            {form.formState.errors.companyName && <p className="text-sm text-destructive">{form.formState.errors.companyName.message}</p>}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Job Title</label>
            <input 
              {...form.register("jobTitle")} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="e.g. Senior Engineer" 
            />
            {form.formState.errors.jobTitle && <p className="text-sm text-destructive">{form.formState.errors.jobTitle.message}</p>}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Location</label>
            <input 
              {...form.register("location")} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="e.g. San Francisco, CA (or Remote)" 
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <select 
              {...form.register("status")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Compensation */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Compensation</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Base Salary</label>
              <input 
                type="number"
                {...form.register("baseSalary")} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="0" 
              />
              {form.formState.errors.baseSalary && <p className="text-sm text-destructive">{form.formState.errors.baseSalary.message}</p>}
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Currency</label>
              <select 
                {...form.register("currency")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Sign-on Bonus</label>
              <input 
                type="number"
                {...form.register("signOnBonus")} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="0" 
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Target Bonus</label>
              <input 
                type="number"
                {...form.register("bonus")} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="0" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Equity Value</label>
              <input 
                type="number"
                {...form.register("equity")} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="0" 
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Equity Type</label>
              <select 
                {...form.register("equityType")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select type...</option>
                <option value="RSU">RSU</option>
                <option value="Options">Options</option>
                <option value="Profit Sharing">Profit Sharing</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-border">
        {/* Benefits */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Benefits</h3>
          <div className="grid grid-cols-2 gap-4">
            {(["healthInsurance", "dentalInsurance", "visionInsurance", "retirementPlan", "relocation", "learningBudget", "wfhAllowance", "flexibleHours"] as const).map((key) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register(`benefits.${key}`)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
              </label>
            ))}
          </div>
          <div className="grid gap-2 mt-4">
            <label className="text-sm font-medium">Other Benefits</label>
            <input 
              {...form.register("benefits.other")} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Any other perks..." 
            />
          </div>
        </div>

        {/* Additional Details & Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Details</h3>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">PTO Days</label>
            <input 
              type="number"
              {...form.register("ptoDays")} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="e.g. 21" 
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea 
              {...form.register("notes")} 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Any specific thoughts or requirements for this offer..." 
            />
          </div>

          <div className="grid gap-2 pt-2">
            <label className="text-sm font-medium">Offer Document (PDF)</label>
            <div className="flex flex-col gap-4">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-6 text-sm hover:bg-muted/50 transition-colors">
                <UploadCloud className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{file ? file.name : "Click to upload PDF"}</span>
                <input 
                  type="file" 
                  accept=".pdf"
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
              
              {file && (
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={handleAiExtract}
                    disabled={isExtracting}
                    className="inline-flex items-center gap-2 text-sm font-medium bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 px-3 py-1.5 rounded-md transition-colors"
                  >
                    {isExtracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {isExtracting ? "Analyzing..." : "Auto-fill with AI"}
                  </button>
                  <button type="button" onClick={() => setFile(null)} className="text-sm text-destructive hover:underline">
                    Remove file
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Create Offer"}
        </button>
      </div>
    </form>
    </>
  )
}
