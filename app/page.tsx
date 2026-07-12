import { Navbar } from '@/components/marketing/navbar'
import { Hero } from '@/components/marketing/hero'
import { ProductOverview } from '@/components/marketing/product-overview'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { ProductBenefits } from '@/components/marketing/product-benefits'
import { Architecture } from '@/components/marketing/architecture'
import { FAQ } from '@/components/marketing/faq'
import { CTA } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductOverview />
        <HowItWorks />
        <ProductBenefits />
        <Architecture />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
