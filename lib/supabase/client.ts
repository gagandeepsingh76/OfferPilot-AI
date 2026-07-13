import { createBrowserClient } from '@supabase/ssr'
import { DEMO_AUTH_ID, DEMO_EMAIL, demoUser } from '@/lib/demo-data'

function isSupabaseConfigured(url?: string, key?: string) {
  return Boolean(
    url &&
      key &&
      !url.includes('your-project.supabase.co') &&
      key !== 'your-anon-key'
  )
}

const demoSupabaseUser = {
  id: DEMO_AUTH_ID,
  email: DEMO_EMAIL,
  role: "authenticated",
  user_metadata: {
    full_name: demoUser.name,
    name: demoUser.name,
    avatar_url: demoUser.avatarUrl,
  },
}

export function createClient() {
  const isDemo = typeof document !== 'undefined' && document.cookie.includes('demo_mode=true')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isSupabaseConfigured(supabaseUrl, supabaseKey)) {
    return {
      auth: {
        getUser: async () => ({ data: { user: isDemo ? demoSupabaseUser : null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => ({ data: { url: null }, error: { message: "Google Sign-In is not configured for this deployment." } }),
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

  const supabase = createBrowserClient(supabaseUrl!, supabaseKey!)

  if (isDemo) {
    supabase.auth.getUser = async () => ({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: demoSupabaseUser as any
      },
      error: null
    })
  }

  return supabase
}
