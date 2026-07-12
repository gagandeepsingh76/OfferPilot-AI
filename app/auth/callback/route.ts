import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      const { user } = data
      const name = user.user_metadata?.full_name || user.user_metadata?.name || ''
      const avatarUrl = user.user_metadata?.avatar_url || ''

      // Idempotent upsert into Prisma
      await prisma.user.upsert({
        where: { authId: user.id },
        update: {
          email: user.email!,
          name,
          avatarUrl,
        },
        create: {
          authId: user.id,
          email: user.email!,
          name,
          avatarUrl,
        }
      })
      
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
        ? process.env.NEXT_PUBLIC_APP_URL
        : isLocalEnv 
          ? origin 
          : forwardedHost 
            ? `https://${forwardedHost}` 
            : origin

      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // return the user to an error page with instructions
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin
  return NextResponse.redirect(`${baseUrl}/login?error=auth-callback-failed`)
}
