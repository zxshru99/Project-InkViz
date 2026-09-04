import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
  return (
    <div className="py-20 md:py-32 container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Start for free, upgrade when you need more power. No hidden fees.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for starting freelancers.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><CheckIcon /> Up to 5 invoices/month</li>
              <li className="flex items-center gap-2"><CheckIcon /> 1 Basic Template</li>
              <li className="flex items-center gap-2"><CheckIcon /> PDF Downloads</li>
              <li className="flex items-center gap-2 text-muted-foreground"><CrossIcon /> Custom Brand Colors</li>
              <li className="flex items-center gap-2 text-muted-foreground"><CrossIcon /> Public Share Links</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-primary relative shadow-lg">
          <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
            <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Pro</CardTitle>
            <CardDescription>For growing solo businesses.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-center gap-2"><CheckIcon /> Unlimited invoices</li>
              <li className="flex items-center gap-2"><CheckIcon /> All Premium Templates</li>
              <li className="flex items-center gap-2"><CheckIcon /> PDF Downloads</li>
              <li className="flex items-center gap-2"><CheckIcon /> Custom Brand Colors & Fonts</li>
              <li className="flex items-center gap-2"><CheckIcon /> Magical Public Share Links</li>
              <li className="flex items-center gap-2"><CheckIcon /> Client Address Book</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button className="w-full">Upgrade to Pro</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-32 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold">Can I cancel my Pro subscription?</h3>
            <p className="text-muted-foreground mt-2">Yes, you can cancel your subscription at any time from your billing settings. You will retain access to Pro features until the end of your billing cycle.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">What happens if I hit the invoice limit on the Free plan?</h3>
            <p className="text-muted-foreground mt-2">You won't be able to generate new invoices until the next month, but you can always view, download, and manage your existing invoices.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Are my invoices watermarked?</h3>
            <p className="text-muted-foreground mt-2">No. Even on the Free tier, we never place our logo or branding on your generated PDF invoices. Your brand comes first.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
}

function CrossIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
