"use client"

import { motion } from "framer-motion"
import { Database, Server, Layout, ShieldCheck } from "lucide-react"

export function Architecture() {
  const stack = [
    {
      title: "Frontend",
      description: "Next.js 16 App Router, React 19, Tailwind CSS, Framer Motion",
      icon: <Layout className="w-6 h-6 text-primary" />,
    },
    {
      title: "Backend & API",
      description: "Next.js Server Actions, Vercel AI SDK, Stripe Webhooks",
      icon: <Server className="w-6 h-6 text-primary" />,
    },
    {
      title: "Database & Storage",
      description: "Neon (Serverless Postgres), Prisma ORM, Supabase Storage",
      icon: <Database className="w-6 h-6 text-primary" />,
    },
    {
      title: "Authentication",
      description: "Supabase Auth (SSR) with Google OAuth and Magic Links",
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    },
  ]

  return (
    <section id="architecture" className="py-24 bg-muted/20 border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            System Architecture
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for scale, performance, and security using a modern serverless stack.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {stack.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
