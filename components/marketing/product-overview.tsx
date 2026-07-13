"use client"

import { motion } from "framer-motion"
import { CheckCircle2, TrendingUp, Brain, FileText, Briefcase } from "lucide-react"

export function ProductOverview() {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden relative border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            See your true worth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A beautiful, intuitive dashboard that puts all your job offers side-by-side, calculating total compensation down to the dollar.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative mx-auto rounded-xl border border-border/50 bg-background shadow-2xl overflow-hidden"
        >
          {/* Mac-like window header */}
          <div className="flex items-center px-4 py-3 border-b border-border bg-muted/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="mx-auto text-xs text-muted-foreground font-medium flex items-center gap-2">
              offerpilot.ai/dashboard
            </div>
          </div>
          
          {/* Realistic Dashboard UI */}
          <div className="p-6 md:p-8 grid md:grid-cols-4 gap-6 min-h-[500px]">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col gap-4 border-r border-border pr-6 col-span-1">
              <div className="flex items-center gap-2 font-semibold text-lg pb-4 border-b border-border">
                <Briefcase className="h-5 w-5 text-primary" />
                OfferPilot AI
              </div>
              <div className="space-y-1 mt-2">
                <div className="px-3 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Dashboard
                </div>
                <div className="px-3 py-2 hover:bg-muted text-muted-foreground rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <FileText className="h-4 w-4" /> My Offers
                </div>
                <div className="px-3 py-2 hover:bg-muted text-muted-foreground rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <Brain className="h-4 w-4" /> AI Comparisons
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold tracking-tight">Overview</h3>
                <div className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm">
                  Add New Offer
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Meta Offer */}
                <div className="p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-green-500/10 text-green-600 text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Highest TC
                  </div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Meta</h4>
                  <p className="text-2xl font-bold mb-1">$328,000</p>
                  <p className="text-xs text-muted-foreground mb-4">Senior Software Engineer • E5</p>
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-500/10 w-fit px-2 py-1 rounded-full font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    AI Verified
                  </div>
                </div>

                {/* Google Offer */}
                <div className="p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Google</h4>
                  <p className="text-2xl font-bold mb-1">$301,500</p>
                  <p className="text-xs text-muted-foreground mb-4">Software Engineer • L5</p>
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-500/10 w-fit px-2 py-1 rounded-full font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    AI Verified
                  </div>
                </div>
              </div>
              
              {/* Compensation chart preview */}
              <div className="flex-1 border border-border rounded-xl bg-card p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Compensation Breakdown</h4>
                  <div className="text-xs text-muted-foreground">USD / Year</div>
                </div>
                
                {/* Bar chart representation */}
                <div className="flex-1 flex items-end gap-6 pt-8 pb-2 border-b border-border/50 relative">
                  {/* Meta Bar */}
                  <div className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex flex-col justify-end bg-transparent rounded-t-md overflow-hidden relative group-hover:opacity-90 transition-opacity">
                      <div className="bg-primary/20 h-[80px] w-full border-b border-background/50 relative">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">$160k RSU</span>
                      </div>
                      <div className="bg-primary/40 h-[20px] w-full border-b border-background/50 relative">
                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">$33k Bonus</span>
                      </div>
                      <div className="bg-primary/80 h-[120px] w-full relative">
                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">$220k Base</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Meta (E5)</span>
                  </div>

                  {/* Google Bar */}
                  <div className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex flex-col justify-end bg-transparent rounded-t-md overflow-hidden relative group-hover:opacity-90 transition-opacity">
                      <div className="bg-blue-500/20 h-[60px] w-full border-b border-background/50 relative">
                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">$150k RSU</span>
                      </div>
                      <div className="bg-blue-500/40 h-[15px] w-full border-b border-background/50 relative">
                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">$31.5k Bonus</span>
                      </div>
                      <div className="bg-blue-500/80 h-[110px] w-full relative">
                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">$210k Base</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Google (L5)</span>
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-muted-foreground justify-center">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary/80 rounded-[2px]" /> Base Salary</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary/40 rounded-[2px]" /> Target Bonus</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary/20 rounded-[2px]" /> Equity (Annual)</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
