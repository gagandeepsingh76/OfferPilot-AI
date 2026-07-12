"use client"

import { CommandPalette } from "./command-palette"
import { UserNav } from "./user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import type { User } from "@supabase/supabase-js"

export function Header({ user }: { user?: User | null }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center gap-4 border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-4">
        <CommandPalette />
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <UserNav user={user} />
      </div>
    </header>
  )
}
