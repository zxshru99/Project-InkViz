import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 max-w-2xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Get in touch</h1>
          <p className="text-xl text-muted-foreground mt-4">
            Have a question, feature request, or found a bug? We'd love to hear from you.
          </p>
        </div>
        
        <form className="space-y-6 bg-card p-8 border rounded-xl shadow-sm">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="How can we help?" className="min-h-[150px]" />
          </div>
          <Button type="button" className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  )
}
