"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
]

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ── Floating Island Nav ── */}
      <div
        className={`floating-island transition-all duration-300 ${
          scrolled ? "top-3 shadow-xl" : "top-5"
        }`}
        style={{ width: "min(calc(100vw - 2rem), 880px)" }}
      >
        <div className="flex h-12 items-center justify-between px-5">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-6 h-6 rounded-md bg-foreground text-background flex items-center justify-center transition-transform group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="m9 15 2 2 4-4"/>
              </svg>
            </div>
            <span className="text-[13px] font-semibold tracking-[0.12em] uppercase text-foreground">
              Inkviz
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <button className="h-8 px-4 text-[11px] font-semibold tracking-wider uppercase rounded-full border border-border hover:bg-foreground/5 transition-all text-foreground/80">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="h-8 px-4 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-foreground text-background hover:opacity-80 transition-opacity">
                Start Free
              </button>
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors text-foreground/80"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Full-Screen Menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden bg-background/97 backdrop-blur-xl flex flex-col p-8 pt-24 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-2xl font-light tracking-tight text-foreground hover:text-muted-foreground transition-colors border-b border-border/40"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full h-12 text-sm font-semibold tracking-wider uppercase rounded-2xl border border-border hover:bg-foreground/5 transition-all text-foreground">
                Log In
              </button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full h-12 text-sm font-semibold tracking-wider uppercase rounded-2xl bg-foreground text-background hover:opacity-80 transition-opacity">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Page Content ── */}
      <main className="flex-1 pt-20">{children}</main>

      {/* ── Architectural Footer ── */}
      <footer className="border-t border-border/60 mt-24">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {/* Brand Column */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-foreground text-background flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="m9 15 2 2 4-4"/>
                  </svg>
                </div>
                <span className="text-[13px] font-semibold tracking-[0.12em] uppercase text-foreground">
                  Inkviz
                </span>
              </Link>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[220px]">
                Professional invoicing for solo developers and freelancers.
              </p>
              {/* Live Status */}
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
                <span className="mono-badge text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900">
                  All Systems Operational
                </span>
              </div>
            </div>

            {/* Links Column */}
            <div className="flex flex-col gap-3">
              <p className="mono-badge self-start mb-2">Platform</p>
              {[
                { label: "Features", href: "/#features" },
                { label: "Pricing", href: "/pricing" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Create Invoice", href: "/invoices/new" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Company Column */}
            <div className="flex flex-col gap-3">
              <p className="mono-badge self-start mb-2">Company</p>
              {[
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-muted-foreground font-mono">
              © {new Date().getFullYear()} Inkviz. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              <span className="mono-badge">v2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
