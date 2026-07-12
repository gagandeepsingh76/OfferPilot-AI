import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4">OfferPilot AI</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Make smarter career decisions with AI. Upload and analyze job offers, compare compensation packages, and receive AI-powered negotiation advice.
      </p>
      <div className="flex gap-4">
        <Link href="/signup" className={buttonVariants({ size: 'lg' })}>
          Get Started
        </Link>
        <Link href="/login" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          Log In
        </Link>
      </div>
    </div>
  )
}
