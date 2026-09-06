"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("inkviz_access_token")
      const user = authApi.getCurrentUser()
      if (!token && !user) {
        setIsAuthenticated(false)
        router.push("/login")
      } else {
        setIsAuthenticated(true)
      }
    }
  }, [router])

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
