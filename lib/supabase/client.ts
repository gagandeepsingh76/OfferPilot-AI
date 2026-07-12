import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const isDemo = typeof document !== 'undefined' && document.cookie.includes('demo_mode=true')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      auth: {
        getUser: async () => ({ data: { user: isDemo ? { id: "demo-user-id", email: "demo@offerpilot.ai", role: "authenticated" } : null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => ({ data: null, error: { message: "Google Sign-In is not configured for this deployment." } }),
        signOut: async () => ({ error: null })
      },
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: new Error("Supabase is not configured") }),
          getPublicUrl: () => ({ data: { publicUrl: "" } })
        })
      }
    } as any // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseKey)

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
