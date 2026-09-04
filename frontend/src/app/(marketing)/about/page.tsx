export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 max-w-4xl">
      <div className="space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About Inkviz</h1>
        <p className="text-xl text-muted-foreground">
          Built for solo developers, by a solo developer.
        </p>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-lg text-foreground/80">
          <p>
            When I started freelancing, I was frustrated by the complexity of traditional accounting software. They were bloated with features I didn't need—payroll, complex double-entry ledgers, and inventory management.
          </p>
          <p>
            I just wanted to generate a beautiful, professional PDF invoice in 60 seconds and send it to my client. That's it.
          </p>
          <p>
            Inkviz is the result of that frustration. It's a stripped-down, beautifully designed invoicing tool that gets out of your way and lets you focus on what you do best: building software.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">Our Philosophy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Design matters:</strong> Your invoice is often the last impression you leave with a client. It should look just as good as the work you delivered.</li>
            <li><strong>Speed is essential:</strong> You shouldn't need a manual to figure out how to bill someone.</li>
            <li><strong>No lock-in:</strong> Export your data anytime. We don't hold your business hostage.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
