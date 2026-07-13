import { Navbar } from '@/components/marketing/navbar'
import { Hero } from '@/components/marketing/hero'
import { ProductOverview } from '@/components/marketing/product-overview'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { ProductBenefits } from '@/components/marketing/product-benefits'
import { Architecture } from '@/components/marketing/architecture'
import { Pricing } from '@/components/marketing/pricing'
import { FAQ } from '@/components/marketing/faq'
import { CTA } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'
import { getCurrentAppUser } from '@/lib/current-user'

export default async function Home() {
  const user = await getCurrentAppUser()

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/30">
      <Navbar user={user} />
      <main className="flex-1">
        <Hero />
        <ProductOverview />
        <HowItWorks />
        <ProductBenefits />
        <Architecture />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
