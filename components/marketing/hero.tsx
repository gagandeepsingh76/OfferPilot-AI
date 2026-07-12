"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { buttonVariants, Button } from "@/components/ui/button"
import { enableDemoMode } from "@/server/actions/auth"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="container mx-auto px-4 sm:px-8 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
            Introducing OfferPilot AI 2.0
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
            Make smarter career decisions with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              AI intelligence
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground">
            Upload and analyze job offers, compare compensation packages, and receive AI-powered negotiation advice to maximize your earning potential.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Link href="/signup" className={buttonVariants({ size: "lg", className: "gap-2" })}>
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <form action={enableDemoMode}>
              <Button type="submit" variant="secondary" size="lg" className="gap-2">
                Explore Demo
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
