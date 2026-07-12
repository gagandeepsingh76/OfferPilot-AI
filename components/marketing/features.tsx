"use client"

import { motion } from "framer-motion"
import { Sparkles, BarChart3, FileSearch, ShieldCheck } from "lucide-react"

const features = [
  {
    title: "AI-Powered Negotiation",
    description: "Get personalized negotiation scripts and strategies based on current market data and your specific offer details.",
    icon: Sparkles,
  },
  {
    title: "Compensation Analysis",
    description: "Compare base salary, equity, bonuses, and benefits against industry benchmarks to know exactly where you stand.",
    icon: BarChart3,
  },
  {
    title: "Fine Print Scanner",
    description: "Upload your offer letters and our AI will instantly flag unusual clauses, non-competes, and risky equity terms.",
    icon: FileSearch,
  },
  {
    title: "Total Privacy",
    description: "Your data is encrypted and completely private. We never share your offer details with employers or third parties.",
    icon: ShieldCheck,
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to negotiate like a pro
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform breaks down complex compensation packages into simple, actionable insights so you can confidently ask for more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-8 rounded-2xl border border-border/50 bg-card hover:border-primary/50 transition-colors shadow-sm"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
