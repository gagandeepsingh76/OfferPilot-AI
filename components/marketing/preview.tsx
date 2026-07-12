"use client"

import { motion } from "framer-motion"

export function Preview() {
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
          
          {/* Mock Dashboard UI */}
          <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6 h-[400px] md:h-[500px]">
            {/* Sidebar mock */}
            <div className="hidden md:flex flex-col gap-4 border-r border-border pr-6">
              <div className="h-8 w-3/4 bg-muted rounded-md" />
              <div className="space-y-2 mt-4">
                <div className="h-4 w-full bg-primary/10 rounded-md" />
                <div className="h-4 w-5/6 bg-muted rounded-md" />
                <div className="h-4 w-4/5 bg-muted rounded-md" />
              </div>
            </div>
            
            {/* Main content mock */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="h-8 w-1/3 bg-muted rounded-md" />
                <div className="h-8 w-24 bg-primary/20 rounded-md" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg bg-card space-y-3">
                  <div className="h-4 w-1/2 bg-muted rounded-md" />
                  <div className="h-8 w-3/4 bg-foreground/10 rounded-md" />
                  <div className="h-3 w-1/3 bg-green-500/20 rounded-md" />
                </div>
                <div className="p-4 border border-border rounded-lg bg-card space-y-3">
                  <div className="h-4 w-1/2 bg-muted rounded-md" />
                  <div className="h-8 w-3/4 bg-foreground/10 rounded-md" />
                  <div className="h-3 w-1/3 bg-green-500/20 rounded-md" />
                </div>
              </div>
              
              {/* Chart mock */}
              <div className="flex-1 border border-border rounded-lg bg-card p-4 flex items-end gap-2">
                {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/20 rounded-t-sm"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
