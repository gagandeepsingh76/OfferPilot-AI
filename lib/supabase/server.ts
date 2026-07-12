import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('demo_mode')?.value === 'true'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      auth: {
        getUser: async () => ({ data: { user: isDemo ? { id: "demo-user-id", email: "demo@offerpilot.ai", role: "authenticated" } : null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: new Error("Supabase is not configured") }),
        signUp: async () => ({ data: null, error: new Error("Supabase is not configured") }),
        signInWithOAuth: async () => ({ data: null, error: new Error("Google Sign-In is not configured for this deployment.") }),
        exchangeCodeForSession: async () => ({ data: null, error: new Error("Supabase is not configured") }),
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

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
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
