"use client"

import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authApi } from "@/lib/api"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRegistered = searchParams.get("registered") === "true"
  const prefillEmail = searchParams.get("email") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail)
  }, [prefillEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await authApi.login({ email, password })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Invalid email or password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="mono-badge inline-block mb-4">Sign In</div>
        <h1 className="text-3xl font-light tracking-[-0.03em] text-foreground mb-1.5">
          Welcome back.
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Enter your credentials to access your workspace.
        </p>
      </div>

      {/* Success Banner */}
      {isRegistered && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[13px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          Account created! Please sign in to continue.
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-[13px] text-destructive animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 px-4 text-[14px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
              Password
            </label>
            <Link href="#" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-11 px-4 text-[14px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-2 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-xl bg-foreground text-background hover:opacity-80 disabled:opacity-50 transition-opacity"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-[13px] text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-foreground hover:underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
