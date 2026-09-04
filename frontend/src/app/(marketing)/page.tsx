import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none">
                  Invoicing made <span className="text-primary">beautifully simple.</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Create, manage, and share professional invoices in seconds. Built specifically for solo developers and freelancers who want to look professional without the hassle.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8">Get Started</Button>
                </Link>
                <Link href="/#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8">See Features</Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground font-medium">No credit card required. Free tier available.</p>
            </div>
            <div className="mx-auto w-full max-w-[600px] lg:max-w-none shadow-2xl rounded-xl border border-border/50 overflow-hidden bg-card">
              <div className="bg-muted px-4 py-3 border-b flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-muted-foreground ml-2 font-mono">inkviz-dashboard</div>
              </div>
              <div className="p-5 bg-card/50 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-left">
                  <div className="p-2.5 rounded-lg border bg-background/80">
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Outstanding</div>
                    <div className="text-sm font-bold text-foreground mt-0.5">$1,700.00</div>
                  </div>
                  <div className="p-2.5 rounded-lg border bg-background/80">
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Collected</div>
                    <div className="text-sm font-bold text-emerald-600 mt-0.5">$3,200.00</div>
                  </div>
                  <div className="p-2.5 rounded-lg border bg-background/80">
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Drafts</div>
                    <div className="text-sm font-bold text-foreground mt-0.5">2 Pending</div>
                  </div>
                </div>

                <div className="rounded-lg border bg-background p-3 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-semibold text-foreground">INV-0012 · Acme Corp</div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600">PAID</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Full-Stack SaaS Development</span>
                    <span className="font-medium text-foreground">$1,250.00</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cloud Architecture Setup</span>
                    <span className="font-medium text-foreground">$450.00</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between font-bold text-foreground">
                    <span>Total Due</span>
                    <span className="text-primary font-extrabold">$1,700.00</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Live Syncing Enabled
                  </span>
                  <span className="font-mono text-[10px]">6 Signature Templates Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything you need, nothing you don't</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              We stripped away the complexity of traditional accounting software and focused entirely on helping you get paid faster with stunning invoices.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Customizable Themes", desc: "Match your brand with custom colors, fonts, and beautifully designed templates.", icon: "🎨" },
              { title: "Drag-and-Drop Line Items", desc: "Easily reorder your invoice line items intuitively. No clunky forms.", icon: "✨" },
              { title: "Public Share Links", desc: "Send clients a magical, read-only link to view and download their invoice.", icon: "🔗" },
              { title: "Smart Calculations", desc: "Automatic subtotal, tax, discount, and balance due calculations.", icon: "🧮" },
              { title: "Client Address Book", desc: "Save client details once and auto-fill them on future invoices instantly.", icon: "📖" },
              { title: "Dark Mode Native", desc: "A gorgeous dark mode experience built in from day one.", icon: "🌙" }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 border rounded-xl bg-card hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4 p-3 bg-primary/10 rounded-full">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-32 bg-muted/30 border-t border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">Generate your first invoice in under 60 seconds.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Pick a Template", desc: "Choose from Classic, Modern, or Minimal designs that fit your brand vibe." },
              { step: "02", title: "Fill Details", desc: "Add line items, taxes, discounts, and client details in a live WYSIWYG editor." },
              { step: "03", title: "Share & Get Paid", desc: "Send a public share link to your client or download a pixel-perfect PDF." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col p-6 items-center text-center space-y-4 relative">
                {i !== 2 && <div className="hidden md:block absolute top-12 left-[60%] w-full h-[2px] bg-border/80 border-dashed border-t-2" />}
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 relative shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8 bg-primary/5 border border-primary/20 rounded-3xl p-10 md:p-16">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to look professional?</h2>
            <p className="text-lg md:text-xl text-muted-foreground">Join freelancers who trust Inkviz to manage their billing.</p>
            <Link href="/signup" className="inline-block">
              <Button size="lg" className="text-lg h-14 px-10 rounded-full">Create Your Free Account</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
