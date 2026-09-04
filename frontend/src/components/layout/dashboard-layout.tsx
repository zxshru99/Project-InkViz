"use client"

import * as React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 min-h-screen">
        <Header />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
