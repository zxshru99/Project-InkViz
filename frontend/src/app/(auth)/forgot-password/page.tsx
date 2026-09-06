"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import { ArrowLeft, CheckCircle2, RefreshCw, KeyRound, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<"request" | "verify">("request")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setIsLoading(true)

    try {
      await authApi.forgotPassword(email)
      setStep("verify")
      setCountdown(60)
      setSuccessMsg(`A 6-digit reset code has been sent to ${email}`)
    } catch (err: any) {
      setError(err.message || "Failed to send reset code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    setError(null)
    setSuccessMsg(null)
    setIsLoading(true)

    try {
      await authApi.resendOtp({ email, type: "password_reset" })
      setCountdown(60)
      setSuccessMsg("A new verification code has been dispatched to your email.")
    } catch (err: any) {
      setError(err.message || "Failed to resend code.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)
    try {
      await authApi.resetPasswordWithOtp({
        email,
        otp,
        password,
      })
      setSuccessMsg("Password reset successfully! Redirecting to login...")
      setTimeout(() => {
        router.push(`/login?reset=true&email=${encodeURIComponent(email)}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please check your OTP code.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    "w-full h-11 px-4 text-[14px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"

  return (
    <div className="space-y-7">
      {/* Back Link */}
      <div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to sign in
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="mono-badge inline-flex items-center gap-1.5 mb-4">
          <KeyRound className="w-3 h-3 text-muted-foreground" />
          Password Recovery
        </div>
        <h1 className="text-3xl font-light tracking-[-0.03em] text-foreground mb-1.5">
          {step === "request" ? "Forgot your password?" : "Reset your password"}
        </h1>
        <p className="text-[13px] text-muted-foreground">
          {step === "request"
            ? "Enter your account email address and we'll send you a 6-digit OTP code to reset your password."
            : `Enter the 6-digit code sent to ${email} and choose a new password.`}
        </p>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[13px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          {successMsg}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-[13px] text-destructive animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {step === "request" ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
              Account Email
            </label>
            <div className="relative">
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
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full h-11 mt-2 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-xl bg-foreground text-background hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Sending code..." : "Send Reset Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* OTP Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="otp" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
                6-Digit Verification Code
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep("request")
                  setOtp("")
                }}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Change Email
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
              className={`${inputClass} tracking-[0.4em] font-mono text-center text-lg`}
            />
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
              New Password
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-[12px] font-mono tracking-[0.1em] uppercase text-muted-foreground">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Resend Code Button */}
          <div className="flex items-center justify-between text-[12px] pt-1">
            <span className="text-muted-foreground">Didn&apos;t receive the code?</span>
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
            disabled={isLoading || otp.length !== 6 || !password || !confirmPassword}
            className="w-full h-11 mt-2 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-xl bg-foreground text-background hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Resetting password..." : "Set New Password"}
          </button>
        </form>
      )}

      <p className="text-center text-[13px] text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
