"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the plan that fits your career goals. Upgrade any time.
          </p>
        </div>

        <div className="mx-auto grid max-w-lg grid-cols-1 items-center gap-y-6 lg:max-w-4xl lg:grid-cols-2">
          <div className="rounded-xl bg-card p-8 ring-1 ring-border sm:p-10">
            <h3 className="text-base font-semibold leading-7 text-primary">Starter</h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight">$0</span>
              <span className="text-base text-muted-foreground">/forever</span>
            </p>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              Perfect for getting a quick read on a single offer.
            </p>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-x-3">
                <CheckCircle2 className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                Upload up to 1 offer
              </li>
              <li className="flex gap-x-3">
                <CheckCircle2 className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                Basic parsing
              </li>
              <li className="flex gap-x-3 text-muted-foreground/70">
                <XCircle className="h-6 w-5 flex-none" aria-hidden="true" />
                AI Negotiation Coaching
              </li>
              <li className="flex gap-x-3 text-muted-foreground/70">
                <XCircle className="h-6 w-5 flex-none" aria-hidden="true" />
                Offer Comparisons
              </li>
            </ul>
            <Link href="/signup" className={buttonVariants({ variant: "outline", className: "mt-8 w-full" })}>
              Get Started
            </Link>
          </div>

          <div className="relative rounded-xl bg-primary p-8 shadow-2xl ring-1 ring-border sm:p-10">
            <h3 className="text-base font-semibold leading-7 text-primary-foreground">Pro</h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-primary-foreground">$19</span>
              <span className="text-base text-primary-foreground/70">/month</span>
            </p>
            <p className="mt-6 text-base leading-7 text-primary-foreground/80">
              Everything you need to maximize your total compensation.
            </p>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-primary-foreground/80">
              <li className="flex gap-x-3">
                <CheckCircle2 className="h-6 w-5 flex-none text-primary-foreground" aria-hidden="true" />
                Unlimited offer uploads
              </li>
              <li className="flex gap-x-3">
                <CheckCircle2 className="h-6 w-5 flex-none text-primary-foreground" aria-hidden="true" />
                Advanced AI insights
              </li>
              <li className="flex gap-x-3">
                <CheckCircle2 className="h-6 w-5 flex-none text-primary-foreground" aria-hidden="true" />
                AI Negotiation Coaching
              </li>
              <li className="flex gap-x-3">
                <CheckCircle2 className="h-6 w-5 flex-none text-primary-foreground" aria-hidden="true" />
                Side-by-side Comparisons
              </li>
            </ul>
            <Link href="/signup" className={buttonVariants({ variant: "secondary", className: "mt-8 w-full" })}>
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
