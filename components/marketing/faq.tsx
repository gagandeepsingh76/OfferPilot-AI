"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is OfferPilot AI really free?",
    answer: "Yes! Our Free plan allows you to analyze and compare a single job offer completely free of charge. If you need to analyze multiple offers or access our advanced AI negotiation scripts, you can upgrade to the Pro plan."
  },
  {
    question: "How accurate is the compensation data?",
    answer: "We source our compensation data from a combination of public datasets, verified user submissions, and real-time market trends. It is highly accurate for tech roles in major US hubs and remote positions."
  },
  {
    question: "Will my employer know I'm using this?",
    answer: "Absolutely not. We take your privacy seriously. Your data is encrypted, anonymized, and never shared with employers, recruiters, or any third parties."
  },
  {
    question: "Can it scan PDFs and Word documents?",
    answer: "Yes, our Fine Print Scanner can process PDFs, Word documents, and images of your offer letters to extract the relevant terms and flag any risks."
  },
  {
    question: "How do the AI negotiation scripts work?",
    answer: "Based on the gap between your offer and market value, our AI generates professional, tactful email templates you can send to your recruiter to negotiate for higher base salary, more equity, or a sign-on bonus."
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about OfferPilot AI.
          </p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
