"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Check } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for evaluating a single job offer.",
    features: [
      "Analyze 1 job offer",
      "Basic compensation breakdown",
      "Standard market data",
      "Community support",
    ],
    cta: "Get Started",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For active job seekers negotiating multiple offers.",
    features: [
      "Analyze unlimited offers",
      "Side-by-side comparisons",
      "AI Negotiation Scripts",
      "Fine print risk scanner",
      "Premium support",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Invest in your career. Our Pro plan pays for itself with your first successfully negotiated offer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex flex-col p-8 rounded-3xl border ${
                plan.popular 
                  ? "border-primary shadow-lg scale-100 md:scale-105 z-10 bg-card" 
                  : "border-border/50 bg-background"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline text-5xl font-extrabold">
                {plan.price}
                {plan.period && <span className="text-xl font-medium text-muted-foreground ml-1">{plan.period}</span>}
              </div>
              
              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href={plan.href}
                className={buttonVariants({
                  variant: plan.popular ? "default" : "outline",
                  className: "w-full py-6 text-lg",
                })}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
