import { Navbar } from '@/components/marketing/navbar'
import { Hero } from '@/components/marketing/hero'
import { TrustedBy } from '@/components/marketing/trusted-by'
import { Features } from '@/components/marketing/features'
import { Preview } from '@/components/marketing/preview'
import { Pricing } from '@/components/marketing/pricing'
import { ProductBenefits } from '@/components/marketing/product-benefits'
import { FAQ } from '@/components/marketing/faq'
import { CTA } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <Preview />
        <Features />
        <ProductBenefits />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
