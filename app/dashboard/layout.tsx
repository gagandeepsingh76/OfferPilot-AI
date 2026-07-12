import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { createClient } from "@/lib/supabase/server"

import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('demo_mode')?.value === 'true'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full flex-1">
        <Header user={user} />
        <main className="flex-1 p-4 sm:p-8">
          {isDemo && (
            <div className="mb-4 rounded-md bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 text-sm text-yellow-600 flex items-center justify-center font-medium">
              You are currently viewing a seeded Demo Account. Any changes made here are temporary.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
