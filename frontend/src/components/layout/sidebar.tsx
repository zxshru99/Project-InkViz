"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, FilePlus2, Trash2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { title: "New Invoice", href: "/invoices/new", icon: FilePlus2 },
  { title: "Trash", href: "/trash", icon: Trash2 },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function InkvizLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 group px-1">
      <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="m9 15 2 2 4-4" />
        </svg>
      </div>
      <span className="text-[13px] font-semibold tracking-[0.1em] uppercase text-foreground">
        Inkviz
      </span>
    </Link>
  )
}

export const InvoizmoLogo = InkvizLogo

export function SidebarNavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="space-y-1">
      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/60 px-3 mb-3">
        Workspace
      </p>
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
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-background" : "text-muted-foreground"
              )}
            />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </div>
  )
}

export function Sidebar() {
  return (
    <nav className="hidden md:flex flex-col w-56 border-r border-border/60 bg-sidebar min-h-screen py-6 px-3 gap-6 shrink-0 print-hidden">
      {/* Brand */}
      <div className="px-1">
        <InkvizLogo />
      </div>

      {/* Main Nav */}
      <div className="flex-1">
        <SidebarNavItems />
      </div>

      {/* Bottom upgrade panel */}
      <div className="rounded-xl border border-border/60 bg-background/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <p className="text-[11px] font-mono tracking-wider uppercase text-muted-foreground">
            All Systems Active
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">
          Fast &amp; beautiful invoices with custom signature templates.
        </p>
        <Link href="/settings" className="block">
          <button className="w-full py-2 px-3 text-[11px] font-semibold tracking-wider uppercase text-center rounded-lg border border-border hover:bg-foreground/5 transition-colors text-foreground">
            Manage Branding
          </button>
        </Link>
      </div>
    </nav>
  )
}
