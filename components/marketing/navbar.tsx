"use client"

import * as React from "react"
import Link from "next/link"
import { Rocket } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import type { User } from "@supabase/supabase-js"

export function Navbar({ user, isDemo }: { user?: User | null, isDemo?: boolean }) {
  const isAuthenticated = !!user || isDemo
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 sm:px-8">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span className="font-bold sm:inline-block">OfferPilot AI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
            <Link href="#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">
              How It Works
            </Link>
            <Link href="#benefits" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Benefits
            </Link>
            <Link href="#faq" className="transition-colors hover:text-foreground/80 text-foreground/60">
              FAQ
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
            <ModeToggle />
            {isAuthenticated ? (
              <Link href="/dashboard" className={buttonVariants({ size: "sm" })}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  Log in
                </Link>
                <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
