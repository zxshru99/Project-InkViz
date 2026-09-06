"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setIsLoading(true)
    try {
      await authApi.register({ name, email, password })
      router.push(`/login?registered=true&email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    "w-full h-11 px-4 text-[14px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="mono-badge inline-block mb-4">Get Started</div>
        <h1 className="text-3xl font-light tracking-[-0.03em] text-foreground mb-1.5">
          Create an account.
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Start sending beautiful invoices today. Free forever.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-[13px] text-destructive animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>

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
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-2 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-xl bg-foreground text-background hover:opacity-80 disabled:opacity-50 transition-opacity"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
