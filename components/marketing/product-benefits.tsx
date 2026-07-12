"use client"

import { motion } from "framer-motion"
import { Shield, Brain, Zap, Target } from "lucide-react"

export function ProductBenefits() {
  const benefits = [
    {
      title: "Why OfferPilot AI",
      description: "Navigating job offers is complex and emotionally taxing. We built OfferPilot AI to level the playing field between candidates and recruiters, giving you data-driven insights to negotiate from a position of strength.",
      icon: <Target className="w-6 h-6 text-primary" />,
    },
    {
      title: "How It Works",
      description: "Simply upload your PDF offer letters. Our proprietary parser instantly extracts salary, equity, and benefits. Then, our AI comparison engine highlights exactly where you should focus your negotiation efforts.",
      icon: <Zap className="w-6 h-6 text-primary" />,
    },
    {
      title: "AI Capabilities",
      description: "Powered by advanced LLMs, OfferPilot doesn't just read numbers—it understands them. Our AI Negotiation Coach acts as your personal advisor, drafting professional emails tailored to your specific leverage points.",
      icon: <Brain className="w-6 h-6 text-primary" />,
    },
    {
      title: "Security & Privacy",
      description: "Your career data is highly sensitive. All uploaded documents are securely processed and immediately locked behind enterprise-grade authentication. We never sell your personal compensation data.",
      icon: <Shield className="w-6 h-6 text-primary" />,
    },
  ]

  return (
    <section id="benefits" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to negotiate smarter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive suite of tools designed to maximize your career trajectory and ensure you never leave money on the table.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col gap-4 p-8 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
