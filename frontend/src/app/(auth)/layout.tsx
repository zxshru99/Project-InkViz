import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand/Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/90 to-primary flex-col justify-between p-12 text-primary-foreground">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <span className="bg-primary-foreground text-primary p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            </span>
            Inkviz
          </Link>
        </div>
        <div>
          <blockquote className="text-3xl font-bold leading-tight mb-4">
            "Inkviz changed how I manage my freelance business. Generating professional invoices now takes me less than a minute."
          </blockquote>
          <p className="text-primary-foreground/80 text-lg">— Alex P., Solo Developer</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center justify-center gap-2 font-bold text-2xl text-primary mb-8">
            <span className="bg-primary text-primary-foreground p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            </span>
            Inkviz
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
