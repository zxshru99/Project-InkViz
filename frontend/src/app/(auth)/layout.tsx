import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left Side — Brand / Atmosphere ── */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-14 overflow-hidden bg-foreground text-background">
        {/* Atmospheric radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-background/[0.03] blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full bg-background/[0.04] blur-[80px]" />
        </div>

        {/* Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-background text-foreground flex items-center justify-center transition-transform group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="m9 15 2 2 4-4"/>
            </svg>
          </div>
          <span className="text-[13px] font-semibold tracking-[0.12em] uppercase text-background/90">
            Inkviz
          </span>
        </Link>

        {/* Large architectural quote */}
        <div className="relative z-10 space-y-6">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-background/40 mb-6">
            Trusted by 10,000+ freelancers
          </div>
          <blockquote className="text-2xl md:text-3xl font-light leading-[1.3] tracking-[-0.02em] text-background">
            "Inkviz changed how I manage my freelance business. Generating professional invoices now takes me less than a minute."
          </blockquote>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center text-[11px] font-semibold text-background">
              AP
            </div>
            <div>
              <p className="text-[13px] font-medium text-background/90">Alex P.</p>
              <p className="text-[11px] text-background/50 font-mono tracking-wide">Solo Developer</p>
            </div>
          </div>
        </div>

        {/* Bottom live telemetry */}
        <div className="relative z-10 flex items-center gap-6">
          {[
            { value: "50M+", label: "Invoiced" },
            { value: "99.9%", label: "Uptime" },
            { value: "< 1s", label: "PDF" },
          ].map((m) => (
            <div key={m.label}>
              <div className="text-xl font-light tracking-tight text-background">{m.value}</div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-background/40">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Side — Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile brand */}
        <Link
          href="/"
          className="lg:hidden flex items-center gap-2 mb-10 self-start"
        >
          <div className="w-6 h-6 rounded-md bg-foreground text-background flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="m9 15 2 2 4-4"/>
            </svg>
          </div>
          <span className="text-[13px] font-semibold tracking-[0.12em] uppercase text-foreground">
            Inkviz
          </span>
        </Link>

        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
