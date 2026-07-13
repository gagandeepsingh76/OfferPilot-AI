"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Rocket, LayoutDashboard, Briefcase, BarChart2, Settings, FileText, LineChart, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Offers", href: "/dashboard/offers", icon: Briefcase },
  { name: "Comparisons", href: "/dashboard/comparisons", icon: BarChart2 },
  { name: "Resume", href: "/dashboard/resume", icon: FileText },
  { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { name: "Insights", href: "/dashboard/insights", icon: Sparkles },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card text-card-foreground">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Rocket className="h-5 w-5 text-primary" />
          <span className="font-bold tracking-tight">OfferPilot AI</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`) && item.href !== "/dashboard"
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
