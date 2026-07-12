import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const isDemo = typeof document !== 'undefined' && document.cookie.includes('demo_mode=true')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
  )

  if (isDemo) {
    supabase.auth.getUser = async () => ({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: { id: "demo-user-id", email: "demo@offerpilot.ai", role: "authenticated" } as any
      },
      error: null
    })
  }

  return supabase
}
