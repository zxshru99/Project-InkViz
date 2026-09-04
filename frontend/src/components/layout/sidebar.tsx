"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, FilePlus2, Trash2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { title: "Create invoice", href: "/invoices/new", icon: FilePlus2 },
  { title: "Trash", href: "/trash", icon: Trash2 },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function InkvizLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 px-3 group">
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-primary to-violet-600 text-white flex items-center justify-center shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white drop-shadow-xs"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="m9 15 2 2 4-4" />
        </svg>
      </div>
      <span className="font-bold text-2xl tracking-tight text-foreground font-heading">
        Inkviz
      </span>
    </Link>
  )
}

export const InvoizmoLogo = InkvizLogo

export function SidebarNavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 mb-2">
          Workspace
        </p>
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/invoices"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <nav className="hidden md:flex flex-col w-64 border-r bg-card/60 backdrop-blur-md min-h-screen p-4 gap-6 shrink-0 print-hidden">
      {/* Brand Header */}
      <div className="py-2">
        <InkvizLogo />
      </div>

      {/* Main Clean Navigation */}
      <div className="flex-1">
        <SidebarNavItems />
      </div>

      {/* Clean Bottom Pro Banner */}
      <div className="rounded-2xl border bg-gradient-to-b from-muted/50 to-muted/20 p-4">
        <p className="text-xs font-semibold text-foreground mb-1">Inkviz Pro</p>
        <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
          Fast & beautiful invoices with custom signature templates.
        </p>
        <Link href="/settings" className="block w-full">
          <button className="w-full py-2 px-3 text-xs font-semibold text-center rounded-xl bg-background border hover:bg-muted/80 transition-colors cursor-pointer text-foreground shadow-xs">
            Manage Branding
          </button>
        </Link>
      </div>
    </nav>
  )
}
