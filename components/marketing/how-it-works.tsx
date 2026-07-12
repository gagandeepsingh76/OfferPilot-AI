"use client"

import { motion } from "framer-motion"
import { FileUp, Cpu, LineChart, MessageSquare } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      title: "1. Upload Your Offer",
      description: "Securely upload your PDF offer letter. Our system instantly parses the document.",
      icon: <FileUp className="w-6 h-6 text-primary" />,
    },
    {
      title: "2. AI Extraction",
      description: "Advanced LLMs extract base salary, equity, bonuses, and benefits with high accuracy.",
      icon: <Cpu className="w-6 h-6 text-primary" />,
    },
    {
      title: "3. Compare & Analyze",
      description: "View multiple offers side-by-side to understand your true total compensation.",
      icon: <LineChart className="w-6 h-6 text-primary" />,
    },
    {
      title: "4. Negotiate",
      description: "Use the AI Negotiation Coach to draft counter-offers and email responses.",
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From PDF to negotiated offer in four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
          
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative z-10 flex flex-col items-center text-center bg-background p-4 rounded-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted border-4 border-background flex items-center justify-center mb-6 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
