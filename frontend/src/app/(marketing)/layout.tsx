import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <span className="bg-primary text-primary-foreground p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            </span>
            Inkviz
          </Link>
          <nav className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
          </nav>
          <div className="ml-auto md:ml-6 flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/20">
        <div className="container mx-auto flex flex-col gap-4 py-10 px-4 md:px-6 md:flex-row md:justify-between md:items-center text-center md:text-left">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2 font-bold text-lg text-primary">
              Inkviz
            </Link>
            <p className="text-sm text-muted-foreground">Beautiful invoicing for solo developers.</p>
          </div>
          <div className="flex gap-4 justify-center md:justify-end text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:underline underline-offset-4">Privacy</Link>
            <Link href="/contact" className="hover:underline underline-offset-4">Contact</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Inkviz. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
