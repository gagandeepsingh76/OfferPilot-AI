import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { sanitizeRedirectPath, stripTrailingSlash } from '@/lib/url'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  const next = sanitizeRedirectPath(searchParams.get('next'), '/dashboard')

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      const { user } = data
      const email = user.email || user.user_metadata?.email
      const name = user.user_metadata?.full_name || user.user_metadata?.name || (email ? email.split('@')[0] : 'OfferPilot User')
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || ''

      if (!email) {
        return NextResponse.redirect(`${origin}/login?error=missing-email`)
      }

      // Idempotent upsert into Prisma
      await prisma.user.upsert({
        where: { authId: user.id },
        update: {
          email,
          name,
          avatarUrl,
        },
        create: {
          authId: user.id,
          email,
          name,
          avatarUrl,
        }
      })
      
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('your-domain.com')
        ? stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL)
        : isLocalEnv 
          ? stripTrailingSlash(origin)
          : forwardedHost 
            ? `https://${forwardedHost}` 
            : stripTrailingSlash(origin)

      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // return the user to an error page with instructions
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('your-domain.com')
    ? stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL)
    : stripTrailingSlash(origin)
  return NextResponse.redirect(`${baseUrl}/login?error=auth-callback-failed`)
}
