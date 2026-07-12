import { ReactNode } from 'react'
import { Rocket } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left section - Branding/Image */}
      <div className="hidden md:flex flex-col justify-between bg-zinc-900 p-10 text-white">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Rocket className="h-6 w-6 text-primary" />
          <span>OfferPilot AI</span>
        </div>
        <div>
          <blockquote className="space-y-2">
            <p className="text-lg">
              &quot;OfferPilot AI completely transformed how I approached my job search. 
              The negotiation assistant helped me secure 20% more equity!&quot;
            </p>
            <footer className="text-sm text-zinc-400">
              Sofia Davis, Senior Engineer
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right section - Auth Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-6">
          <div className="md:hidden flex items-center gap-2 text-xl font-bold mb-8">
            <Rocket className="h-6 w-6 text-primary" />
            <span>OfferPilot AI</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
