"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { authApi } from "@/lib/api"
import { SidebarNavItems, InkvizLogo } from "./sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Menu, Settings, Trash2, LogOut, FilePlus2, User } from "lucide-react"

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 sm:px-6 print-hidden">
      {/* Mobile Hamburger & Brand */}
      <div className="flex items-center gap-3 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <InkvizLogo />
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Link href="/invoices/new" className="hidden sm:block">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-xs cursor-pointer font-semibold">
            <FilePlus2 className="mr-1.5 h-4 w-4" /> Create invoice
          </Button>
        </Link>

        <ThemeToggle />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0 border border-border shadow-xs hover:ring-2 hover:ring-primary/20 cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                {initials}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-2xl p-1.5" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-1">
              <Link
                href="/settings?tab=profile"
                className="flex flex-col space-y-1 p-2 hover:bg-muted/60 rounded-xl transition-colors cursor-pointer"
              >
                <p className="text-sm font-semibold leading-none text-foreground">{user?.name || "Inkviz User"}</p>
                <p className="text-xs leading-none text-muted-foreground truncate mt-0.5">
                  {user?.email || "user@inkviz.app"}
                </p>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings?tab=profile" className="cursor-pointer flex items-center rounded-xl">
                <User className="mr-2 h-4 w-4 text-primary" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/invoices/new" className="cursor-pointer flex items-center rounded-xl">
                <FilePlus2 className="mr-2 h-4 w-4" />
                <span>Create invoice</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex items-center rounded-xl">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/trash" className="cursor-pointer flex items-center rounded-xl">
                <Trash2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Trash</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive flex items-center rounded-xl"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Navigation Dialog */}
      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="max-w-xs h-[80vh] overflow-y-auto p-4 flex flex-col">
          <DialogHeader className="pb-3 border-b">
            <DialogTitle>
              <InkvizLogo />
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 py-4">
            <SidebarNavItems onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
