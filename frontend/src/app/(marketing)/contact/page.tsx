"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2, Send } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      setName("")
      setEmail("")
      setMessage("")
      setTimeout(() => setIsSuccess(false), 6000)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-2xl">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Get in touch</h1>
          <p className="text-base sm:text-xl text-muted-foreground mt-2 sm:mt-4">
            Have a question, feature request, or found a bug? We'd love to hear from you.
          </p>
        </div>

        {isSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>Thank you for reaching out! We received your message and will respond within 24 hours.</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 bg-card p-5 sm:p-8 border rounded-2xl shadow-xs">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="min-h-[140px] rounded-xl resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !name.trim() || !email.trim() || !message.trim()}
            className="w-full rounded-xl h-11 font-semibold cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Send Message
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
