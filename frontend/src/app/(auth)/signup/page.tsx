"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import { CheckCircle2, RefreshCw, MailCheck } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<"details" | "verify">("details")
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [infoMsg, setInfoMsg] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfoMsg(null)

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
      setStep("verify")
      setCountdown(60)
      setInfoMsg(`A 6-digit verification code has been dispatched to ${email}`)
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code.")
      return
    }

    setIsLoading(true)
    try {
      await authApi.verifyEmailOtp({ email, otp })
      setInfoMsg("Email verified successfully! Taking you to your dashboard...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 800)
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    setError(null)
    setInfoMsg(null)
    setIsLoading(true)

    try {
      await authApi.resendOtp({ email, type: "verification" })
      setCountdown(60)
      setInfoMsg("A fresh 6-digit code has been sent to your email.")
    } catch (err: any) {
      setError(err.message || "Failed to resend code.")
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
        <div className="mono-badge inline-flex items-center gap-1.5 mb-4">
          {step === "details" ? (
            "Get Started"
          ) : (
            <>
              <MailCheck className="w-3 h-3 text-emerald-500" />
              Email Verification
            </>
          )}
        </div>
        <h1 className="text-3xl font-light tracking-[-0.03em] text-foreground mb-1.5">
          {step === "details" ? "Create an account." : "Verify your email."}
        </h1>
        <p className="text-[13px] text-muted-foreground">
          {step === "details"
            ? "Start sending beautiful invoices today. Free forever."
            : `Enter the 6-digit verification code sent to ${email} to activate your workspace.`}
        </p>
      </div>

      {/* Info Banner */}
      {infoMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[13px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          {infoMsg}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-[13px] text-destructive animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {step === "details" ? (
        /* Step 1: Account Details Form */
        <form onSubmit={handleRegister} className="space-y-4">
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
            {isLoading ? "Creating account..." : "Continue"}
          </button>
        </form>
      ) : (
        /* Step 2: OTP Verification Form */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="otp" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
                6-Digit Code
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep("details")
                  setOtp("")
                }}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Change details
              </button>
            </div>
            <input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
              autoFocus
              className={`${inputClass} tracking-[0.4em] font-mono text-center text-lg`}
            />
          </div>

          {/* Resend Code Option */}
          <div className="flex items-center justify-between text-[12px] pt-1">
            <span className="text-muted-foreground">Didn&apos;t get the code?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={countdown > 0 || isLoading}
              className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline disabled:opacity-50 disabled:no-underline"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full h-11 mt-2 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-xl bg-foreground text-background hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Verifying..." : "Verify & Activate Account"}
          </button>
        </form>
      )}

      <p className="text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
