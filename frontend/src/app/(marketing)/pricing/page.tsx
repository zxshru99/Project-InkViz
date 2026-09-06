import Link from "next/link"

const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
)
const Cross = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40 shrink-0"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)

export default function PricingPage() {
  return (
    <div className="py-20 md:py-32 container mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-20">
        <div className="mono-badge inline-block mb-6">Pricing</div>
        <h1 className="text-4xl md:text-5xl font-light tracking-[-0.03em] text-foreground mb-4">
          Simple, transparent pricing.
        </h1>
        <p className="max-w-lg text-[15px] text-muted-foreground leading-relaxed">
          Start for free. Upgrade when you need more power. No hidden fees, no surprises.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Free */}
        <div className="bento-card p-8 flex flex-col">
          <div className="mb-6">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3">Starter</div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-light tracking-tight text-foreground">$0</span>
              <span className="text-muted-foreground text-sm font-mono">/month</span>
            </div>
            <p className="text-[13px] text-muted-foreground mt-2">Perfect for starting freelancers.</p>
          </div>

          <ul className="space-y-3 flex-1 mb-8">
            {[
              { text: "Up to 5 invoices/month", included: true },
              { text: "1 Basic Template", included: true },
              { text: "PDF Downloads", included: true },
              { text: "Custom Brand Colors", included: false },
              { text: "Public Share Links", included: false },
            ].map((item) => (
              <li key={item.text} className={`flex items-center gap-2.5 text-[13px] ${item.included ? "text-foreground" : "text-muted-foreground/50"}`}>
                {item.included ? <Check /> : <Cross />}
                {item.text}
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="w-full h-11 flex items-center justify-center rounded-xl border border-border text-[12px] font-semibold tracking-[0.1em] uppercase hover:bg-foreground/5 transition-colors text-foreground"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro */}
        <div className="relative bento-card p-8 flex flex-col border-foreground/30 ring-1 ring-foreground/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="mono-badge bg-foreground text-background border-foreground">Most Popular</div>
          </div>

          <div className="mb-6">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3">Professional</div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-light tracking-tight text-foreground">$9</span>
              <span className="text-muted-foreground text-sm font-mono">/month</span>
            </div>
            <p className="text-[13px] text-muted-foreground mt-2">For serious freelancers &amp; agencies.</p>
          </div>

          <ul className="space-y-3 flex-1 mb-8">
            {[
              { text: "Unlimited invoices", included: true },
              { text: "All Templates", included: true },
              { text: "PDF Downloads", included: true },
              { text: "Custom Brand Colors", included: true },
              { text: "Public Share Links", included: true },
              { text: "WhatsApp Sharing", included: true },
              { text: "Bank &amp; Wire Details", included: true },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-2.5 text-[13px] text-foreground">
                <Check />
                <span dangerouslySetInnerHTML={{ __html: item.text }} />
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="w-full h-11 flex items-center justify-center rounded-xl bg-foreground text-background text-[12px] font-semibold tracking-[0.1em] uppercase hover:opacity-80 transition-opacity"
          >
            Start 14-Day Trial
          </Link>
        </div>
      </div>

      {/* FAQ hint */}
      <p className="text-center text-[13px] text-muted-foreground mt-10">
        Questions?{" "}
        <Link href="/contact" className="font-medium text-foreground hover:underline underline-offset-4">
          Talk to us
        </Link>
      </p>
    </div>
  )
}
