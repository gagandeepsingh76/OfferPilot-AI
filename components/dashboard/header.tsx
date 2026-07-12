"use client"

import { CommandPalette } from "./command-palette"
import { UserNav } from "./user-nav"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center gap-4 border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-4">
        <CommandPalette />
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  )
}
