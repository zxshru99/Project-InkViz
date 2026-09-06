"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

const TICKER_EVENTS = [
  { event: "invoice_created", client: "Acme Corp", amount: "$3,200.00", time: "12:34:21" },
  { event: "payment_settled", client: "Globex Inc", amount: "$1,800.50", time: "12:35:07" },
  { event: "pdf_streamed",    client: "Stark Industries", amount: "$12,500.00", time: "12:35:44" },
  { event: "client_viewed",  client: "Initech", amount: "$450.00",   time: "12:36:02" },
  { event: "invoice_sent",   client: "Soylent Corp", amount: "$2,900.00", time: "12:36:18" },
  { event: "payment_settled", client: "Weyland Corp", amount: "$8,100.00", time: "12:36:55" },
]

const BENTO_ITEMS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
    tag: "Real-time",
    title: "Live Cloud Sync",
    desc: "Every invoice instantly reflected across all devices with zero lag.",
    span: "col-span-1",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
      </svg>
    ),
    tag: "Finance",
    title: "Smart Tax & Discount",
    desc: "Automatic subtotal, tax, discount, and balance due calculations in real time.",
    span: "col-span-1",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
      </svg>
    ),
    tag: "Share",
    title: "Public Share Links",
    desc: "One-click magic links. Clients view and download their invoice—no login needed.",
    span: "col-span-2 md:col-span-1",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    tag: "PDF",
    title: "Pixel-Perfect PDFs",
    desc: "Generate stunning, print-ready PDF invoices in under a second.",
    span: "col-span-1",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    tag: "CRM",
    title: "Client Address Book",
    desc: "Save client details once. Auto-fill them on every future invoice.",
    span: "col-span-1",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
      </svg>
    ),
    tag: "Templates",
    title: "6 Signature Themes",
    desc: "Classic, Modern, Minimal, and more. Swap themes in a single click.",
    span: "col-span-1 md:col-span-1",
  },
]

const WORKFLOW_STEPS = [
  { num: "01", title: "Define", desc: "Set your brand — name, logo, colors, bank details. Done once, used forever." },
  { num: "02", title: "Compose", desc: "Add line items, taxes, discounts live in the WYSIWYG editor." },
  { num: "03", title: "Preview", desc: "See the pixel-perfect PDF output update in real time as you type." },
  { num: "04", title: "Dispatch", desc: "Send a public link or download the PDF and invoice your client." },
]

export default function LandingPage() {
  const [tickerIndex, setTickerIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % TICKER_EVENTS.length)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-foreground/[0.025] blur-[120px]" />
        </div>

        {/* Badge */}
        <div className="mono-badge mb-8 inline-block">
          Invoicing Infrastructure
        </div>

        {/* Giant headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.04em] leading-[0.95] text-foreground max-w-4xl mx-auto">
          Invoicing{" "}
          <span className="italic text-muted-foreground">engineered</span>
          <br />
          while you sleep.
        </h1>

        <p className="mt-8 text-[15px] sm:text-[17px] text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
          Create, share, and track professional invoices in seconds. Built for solo developers and freelancers who value their time.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-11 px-7 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-full bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            Start Building
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-11 px-7 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-full border border-border text-foreground/80 hover:bg-foreground/5 transition-all"
          >
            Dashboard
          </Link>
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground font-mono tracking-wider">
          No credit card required · Free tier available
        </p>

        {/* Telemetry Counters */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { value: "50M+", label: "Invoiced" },
            { value: "99.9%", label: "Uptime" },
            { value: "< 1s", label: "PDF Generate" },
            { value: "6", label: "Templates" },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-3xl md:text-4xl font-light tracking-[-0.04em] text-foreground">
                {m.value}
              </div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE AUDIT TICKER ── */}
      <section className="border-t border-b border-border/60 py-5 overflow-hidden bg-card/40">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
              <span className="mono-badge border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400">
                Live Activity
              </span>
            </div>
            <div className="flex-1 overflow-hidden h-5 relative">
              {mounted && (
                <div
                  key={tickerIndex}
                  className="absolute inset-0 flex items-center gap-3 ticker-item"
                >
                  <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                    {TICKER_EVENTS[tickerIndex].time}
                  </span>
                  <span className="mono-badge text-[10px] shrink-0">
                    {TICKER_EVENTS[tickerIndex].event}
                  </span>
                  <span className="text-[12px] text-foreground/80 font-medium truncate">
                    {TICKER_EVENTS[tickerIndex].client}
                  </span>
                  <span className="text-[12px] font-mono text-foreground ml-auto shrink-0">
                    {TICKER_EVENTS[tickerIndex].amount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID ── */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="mb-12 text-center">
            <div className="mono-badge inline-block mb-5">Platform</div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[-0.03em] text-foreground">
              Everything in one place
            </h2>
            <p className="mt-4 text-[14px] text-muted-foreground max-w-md mx-auto leading-relaxed">
              We stripped away the complexity of traditional accounting software and built exactly what freelancers need.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENTO_ITEMS.map((item, i) => (
              <div key={i} className={`bento-card p-6 flex flex-col gap-4 ${item.span}`}>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-foreground/70">
                    {item.icon}
                  </div>
                  <span className="mono-badge">{item.tag}</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-foreground mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW STEPS ── */}
      <section className="py-24 md:py-32 px-6 border-t border-border/60">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <div className="mono-badge inline-block mb-5">Workflow</div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[-0.03em] text-foreground">
              From zero to invoice
              <br />
              in under 60 seconds.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={i} className="flex flex-col gap-4 p-6 relative">
                {/* Step connector line */}
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-full w-6 h-px bg-border/60 -translate-x-3 z-10" />
                )}
                <div className="text-[42px] font-light tracking-[-0.06em] text-foreground/10 font-mono leading-none select-none">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO INVOICE MOCKUP ── */}
      <section className="py-24 px-6 border-t border-border/60">
        <div className="max-w-3xl mx-auto">
          <div className="bento-card overflow-hidden">
            {/* Window chrome */}
            <div className="bg-muted/40 px-5 py-3 border-b border-border/60 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground ml-2 tracking-wider">inkviz — dashboard</span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
                <span className="font-mono text-[10px] text-muted-foreground">Live Sync</span>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="p-5 md:p-8 space-y-5">
              {/* KPI row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Outstanding", value: "$4,250.00", color: "text-amber-600 dark:text-amber-400" },
                  { label: "Collected",   value: "$18,300.00", color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Drafts",      value: "3 Pending", color: "text-foreground" },
                ].map((kpi) => (
                  <div key={kpi.label} className="p-3 rounded-xl border border-border/60 bg-background/60">
                    <div className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground mb-1">{kpi.label}</div>
                    <div className={`text-sm font-semibold ${kpi.color}`}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Invoice row */}
              {[
                { id: "INV-0012", client: "Acme Corp", amount: "$3,200.00", status: "PAID", statusColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
                { id: "INV-0011", client: "Globex Inc", amount: "$1,050.00", status: "SENT", statusColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10" },
                { id: "INV-0010", client: "Initech",   amount: "$450.00",   status: "DRAFT", statusColor: "text-muted-foreground bg-muted/60" },
              ].map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg border border-border/60 flex items-center justify-center bg-background/60">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">{inv.id}</p>
                      <p className="text-[11px] text-muted-foreground">{inv.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full font-semibold ${inv.statusColor}`}>
                      {inv.status}
                    </span>
                    <span className="text-[12px] font-semibold text-foreground font-mono">{inv.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-32 px-6 text-center border-t border-border/60">
        <div className="max-w-2xl mx-auto">
          <div className="mono-badge inline-block mb-8">Ready?</div>
          <h2 className="text-4xl md:text-6xl font-light tracking-[-0.04em] text-foreground mb-6">
            Look professional.
            <br />
            Get paid faster.
          </h2>
          <p className="text-[15px] text-muted-foreground mb-10 leading-relaxed">
            Join freelancers who trust Inkviz to manage their billing.
            Start free, upgrade when you're ready.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-12 px-10 text-[12px] font-semibold tracking-[0.15em] uppercase rounded-full bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  )
}
