import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { getCurrentAppUser } from "@/lib/current-user"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentAppUser()
  const isDemo = user?.isDemo

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
