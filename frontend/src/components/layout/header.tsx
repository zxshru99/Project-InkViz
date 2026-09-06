"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { authApi } from "@/lib/api"
import { SidebarNavItems, InkvizLogo } from "./sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, Settings, Trash2, LogOut, FilePlus2, User } from "lucide-react"

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const loadUser = () => {
    if (typeof window !== "undefined") {
      const u = authApi.getCurrentUser()
      setUser(u)
    }
  }

  useEffect(() => {
    loadUser()
    const handleAuth = () => loadUser()
    window.addEventListener("inkviz_auth_changed", handleAuth)
    window.addEventListener("storage", handleAuth)
    return () => {
      window.removeEventListener("inkviz_auth_changed", handleAuth)
      window.removeEventListener("storage", handleAuth)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    authApi.logout()
    router.push("/login")
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "IZ"

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-md px-4 sm:px-6 print-hidden">
      {/* Mobile: Hamburger + Brand */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors text-muted-foreground"
          aria-label="Open Navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <InkvizLogo />
      </div>

      {/* Desktop spacer */}
      <div className="hidden md:block" />

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Create Invoice Button */}
        <Link href="/invoices/new" className="hidden sm:block">
          <button className="h-8 px-4 text-[11px] font-semibold tracking-[0.1em] uppercase rounded-full border border-border text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-all">
            <FilePlus2 className="inline-block w-3.5 h-3.5 mr-1.5 -mt-0.5" />
            New Invoice
          </button>
        </Link>

        <ThemeToggle />

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full border border-border bg-foreground text-background flex items-center justify-center text-[11px] font-bold hover:opacity-80 transition-opacity cursor-pointer">
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 rounded-xl p-1.5 border-border/60" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-1">
              <Link
                href="/settings?tab=profile"
                className="flex flex-col space-y-0.5 p-2 hover:bg-foreground/5 rounded-lg transition-colors"
              >
                <p className="text-[13px] font-semibold text-foreground">{user?.name || "Inkviz User"}</p>
                <p className="text-[11px] text-muted-foreground font-mono truncate">
                  {user?.email || "user@inkviz.app"}
                </p>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild>
              <Link href="/settings?tab=profile" className="cursor-pointer flex items-center gap-2 rounded-lg text-[13px]">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/invoices/new" className="cursor-pointer flex items-center gap-2 rounded-lg text-[13px]">
                <FilePlus2 className="h-3.5 w-3.5 text-muted-foreground" />
                New Invoice
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex items-center gap-2 rounded-lg text-[13px]">
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/trash" className="cursor-pointer flex items-center gap-2 rounded-lg text-[13px]">
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                Trash
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2 rounded-lg text-[13px]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Mobile Full-Screen Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative w-64 max-w-[80vw] h-full bg-sidebar border-r border-border/60 shadow-2xl z-10 flex flex-col py-6 px-4 animate-in slide-in-from-left duration-250">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-1">
              <InkvizLogo />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto touch-scroll">
              <SidebarNavItems onNavigate={() => setMobileMenuOpen(false)} />
            </div>

            {/* User Footer */}
            <div className="pt-4 border-t border-border/60 space-y-3">
              <div className="flex items-center gap-2.5 px-1">
                <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold truncate text-foreground">{user?.name || "Inkviz User"}</p>
                  <p className="text-[11px] text-muted-foreground font-mono truncate">{user?.email || ""}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full h-9 text-[11px] font-semibold tracking-wider uppercase rounded-xl border border-border text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
