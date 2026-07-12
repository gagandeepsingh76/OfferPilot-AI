import { Navbar } from '@/components/marketing/navbar'
import { Hero } from '@/components/marketing/hero'
import { ProductOverview } from '@/components/marketing/product-overview'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { ProductBenefits } from '@/components/marketing/product-benefits'
import { Architecture } from '@/components/marketing/architecture'
import { FAQ } from '@/components/marketing/faq'
import { CTA } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('demo_mode')?.value === 'true'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/30">
      <Navbar user={user} isDemo={isDemo} />
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
