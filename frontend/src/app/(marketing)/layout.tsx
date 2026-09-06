"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, ArrowRight } from "lucide-react"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-primary shrink-0">
            <span className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            </span>
            <span className="font-heading tracking-tight">Inkviz</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/#features" className="transition-colors hover:text-foreground text-foreground/70">Features</Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground text-foreground/70">Pricing</Link>
            <Link href="/about" className="transition-colors hover:text-foreground text-foreground/70">About</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-xl font-medium">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl shadow-xs">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="hidden xs:inline-flex">
              <Button variant="ghost" size="sm" className="h-9 px-2.5 text-xs rounded-xl">Login</Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Slide Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 md:hidden bg-background/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col gap-4 text-lg font-medium pt-2">
              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/70 transition-colors"
              >
                <span>Features</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/70 transition-colors"
              >
                <span>Pricing</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/70 transition-colors"
              >
                <span>About</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/70 transition-colors text-muted-foreground text-base"
              >
                <span>Privacy Policy</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/70 transition-colors text-muted-foreground text-base"
              >
                <span>Contact</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-6 border-t">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-11 rounded-xl text-base font-medium">
                  Log In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-base font-semibold shadow-md shadow-primary/20">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/20">
        <div className="container mx-auto flex flex-col gap-4 py-8 px-4 sm:px-6 md:flex-row md:justify-between md:items-center text-center md:text-left">
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2 font-bold text-lg text-primary font-heading">
              Inkviz
            </Link>
            <p className="text-xs text-muted-foreground">Beautiful invoicing for solo developers & freelancers.</p>
          </div>
          <div className="flex gap-4 justify-center md:justify-end text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:underline underline-offset-4">Privacy</Link>
            <Link href="/contact" className="hover:underline underline-offset-4">Contact</Link>
          </div>
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Inkviz. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

