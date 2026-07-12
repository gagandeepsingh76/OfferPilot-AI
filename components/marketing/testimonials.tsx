"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    quote: "OfferPilot AI helped me realize my equity was significantly undervalued. The negotiation script gave me the confidence to ask for more, resulting in a $30k increase in my first year.",
    author: "Sarah J.",
    role: "Senior Frontend Engineer",
  },
  {
    quote: "I was deciding between two offers that looked similar on paper. The side-by-side comparison revealed hidden benefits in one that made the choice obvious.",
    author: "David M.",
    role: "Product Manager",
  },
  {
    quote: "The fine print scanner caught a non-compete clause that would have locked me out of my industry for a year. Absolute lifesaver.",
    author: "Elena R.",
    role: "Data Scientist",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Loved by tech professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how others have used OfferPilot AI to land better compensation packages.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              className="p-8 rounded-2xl bg-background border border-border shadow-sm flex flex-col justify-between"
            >
              <div className="mb-6 text-lg leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </div>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
