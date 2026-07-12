import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full flex-1">
        <Header />
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
