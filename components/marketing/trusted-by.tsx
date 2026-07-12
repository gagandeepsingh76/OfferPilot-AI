"use client"

import { motion } from "framer-motion"

const companies = [
  { name: "Acme Corp", logo: "ACME" },
  { name: "Globex", logo: "GLOBEX" },
  { name: "Soylent", logo: "SOYLENT" },
  { name: "Initech", logo: "INITECH" },
  { name: "Umbrella", logo: "UMBRELLA" },
  { name: "Massive Dynamic", logo: "MASSIVE" },
]

export function TrustedBy() {
  return (
    <section className="py-12 border-y border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8 text-center max-w-5xl">
        <p className="text-sm font-medium text-muted-foreground mb-8">
          Trusted by top engineers negotiating offers at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-60">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-bold tracking-tighter"
            >
              {company.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
