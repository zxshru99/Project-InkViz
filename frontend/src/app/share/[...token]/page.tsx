"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, CreditCard, Printer, CheckCircle2, ArrowLeft, QrCode } from "lucide-react"

const DEFAULT_SHARED_INVOICE = {
  invoiceNumber: "INV-0012",
  issueDate: "2026-09-04",
  dueDate: "2026-10-04",
  status: "published",
  client: { name: "Acme Corp", email: "contact@acme.com", address: "123 Business Rd\nNew York, NY 10001" },
  billFrom: { name: "My Company LLC", email: "hello@mycompany.com", address: "456 Main St\nSan Francisco, CA 94105" },
  items: [
    { id: "1", description: "Web Design Services", quantity: 1, rate: 1000, amount: 1000 },
    { id: "2", description: "Cloud Hosting & Maintenance (1 Year)", quantity: 1, rate: 250, amount: 250 },
  ],
  subtotal: 1250,
  taxAmount: 0,
  discountAmount: 0,
  shippingFee: 0,
  total: 1250,
  balanceDue: 1250,
  notes: "Thank you for your business! Please remit payment before due date.",
  paymentDetails: "Bank: Silicon Valley Bank\nAccount: 9876543210\nRouting: 121000358\nUPI: business@upi",
}

interface PageProps {
  params: Promise<{ token: string | string[] }>
}

export default function PublicSharePage({ params }: PageProps) {
  const resolvedParams = use(params)
  const rawToken = Array.isArray(resolvedParams?.token)
    ? resolvedParams.token.join("/")
    : resolvedParams?.token || "INV-0012"
  const token = decodeURIComponent(rawToken)

  const [invoice, setInvoice] = useState(DEFAULT_SHARED_INVOICE)
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking">("upi")
  const [isProcessingPay, setIsProcessingPay] = useState(false)
  const [paidSuccess, setPaidSuccess] = useState(false)

  // Try to load invoice from localStorage matching token (supporting slashes and URL encoded variants)
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("inkviz_invoices")
      if (raw) {
        const list = JSON.parse(raw)
        const found = list.find(
          (i: any) =>
            i.id === token ||
            i.id === rawToken ||
            encodeURIComponent(i.id) === rawToken ||
            encodeURIComponent(i.id) === token
        )
        if (found) {
          const amount = Number(found.amount) || 0
          setInvoice((prev) => ({
            ...prev,
            invoiceNumber: found.id,
            client: {
              name: found.client || "Valued Client",
              email: found.clientEmail || `${found.client?.toLowerCase().replace(/\s+/g, "") || "client"}@example.com`,
              address: found.clientAddress || "123 Client Blvd, Suite 200",
            },
            issueDate: found.issueDate || prev.issueDate,
            dueDate: found.dueDate || prev.dueDate,
            status: found.status,
            total: amount,
            subtotal: amount,
            balanceDue: found.status === "paid" ? 0 : amount,
            items:
              found.items && found.items.length > 0
                ? found.items
                : [
                    {
                      id: "1",
                      description: found.source || "Professional Services",
                      quantity: 1,
                      rate: amount,
                      amount: amount,
                    },
                  ],
          }))
          if (found.status === "paid") {
            setPaidSuccess(true)
          }
        } else {
          // If not in storage, set the invoice number from token cleanly
          setInvoice((prev) => ({ ...prev, invoiceNumber: token }))
        }
      }
    } catch (e) {
      console.error("Failed to load shared invoice", e)
    }
  }, [token, rawToken])

  const handlePrint = () => {
    window.print()
  }

  const handleSimulatePayment = () => {
    setIsProcessingPay(true)
    setTimeout(() => {
      setIsProcessingPay(false)
      setPaidSuccess(true)
      setPayModalOpen(false)

      setInvoice((prev) => ({
        ...prev,
        status: "paid",
        balanceDue: 0,
      }))

      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("inkviz_invoices")
          if (raw) {
            const list = JSON.parse(raw)
            const updated = list.map((i: any) =>
              i.id === token || i.id === rawToken ? { ...i, status: "paid" } : i
            )
            localStorage.setItem("inkviz_invoices", JSON.stringify(updated))
            window.dispatchEvent(new Event("inkviz_invoices_updated"))
          }
        } catch (e) {}
      }
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-muted/30 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-background p-4 rounded-2xl shadow-xs border print-hidden">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-xs rounded-xl">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                Invoice {invoice.invoiceNumber}
                {invoice.status === "paid" && (
                  <span className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                    PAID
                  </span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground">From {invoice.billFrom.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1 sm:flex-none cursor-pointer rounded-xl">
              <Printer className="mr-1.5 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1 sm:flex-none cursor-pointer rounded-xl">
              <Download className="mr-1.5 h-4 w-4" /> PDF
            </Button>
            {invoice.status !== "paid" && (
              <Button size="sm" onClick={() => setPayModalOpen(true)} className="flex-1 sm:flex-none cursor-pointer bg-primary text-primary-foreground font-semibold rounded-xl">
                <CreditCard className="mr-1.5 h-4 w-4" /> Pay Now
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Paper Document */}
        <Card
          id="invoice-preview-container"
          className="bg-white text-gray-950 p-6 sm:p-10 md:p-12 shadow-md min-h-[800px] flex flex-col mx-auto border-t-8 border-t-primary rounded-2xl relative overflow-hidden"
        >
          {/* Watermark for Paid */}
          {invoice.status === "paid" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
              <div className="border-8 border-emerald-600 text-emerald-600 font-extrabold text-7xl px-10 py-4 rounded-2xl rotate-[-25deg] tracking-widest">
                PAID
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 mb-1">INVOICE</h1>
              <p className="text-sm font-semibold text-gray-500 font-mono">#{invoice.invoiceNumber}</p>
            </div>
            <div className="sm:text-right text-sm text-gray-600">
              <h2 className="font-bold text-lg text-gray-950 mb-1">{invoice.billFrom.name}</h2>
              <div className="whitespace-pre-line leading-relaxed">{invoice.billFrom.address}</div>
              <div className="text-gray-500 mt-1">{invoice.billFrom.email}</div>
            </div>
          </div>

          {/* Bill To & Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 border-b border-gray-200 pb-6">
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-950 mb-1 uppercase tracking-wider text-xs">Billed To:</p>
              <div className="font-bold text-gray-950 text-base">{invoice.client.name}</div>
              <div className="whitespace-pre-line leading-relaxed">{invoice.client.address}</div>
              <div className="text-gray-500 mt-1">{invoice.client.email}</div>
            </div>
            <div className="text-sm sm:text-right w-full sm:w-auto">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="text-gray-500 font-medium">Issue Date:</div>
                <div className="text-gray-900">{invoice.issueDate}</div>

                <div className="text-gray-500 font-medium">Due Date:</div>
                <div className="text-gray-900 font-semibold">{invoice.dueDate}</div>

                <div className="text-gray-500 font-medium">Status:</div>
                <div className={`font-semibold capitalize ${invoice.status === "paid" ? "text-emerald-600" : "text-blue-600"}`}>
                  {invoice.status}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-2 flex-grow overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-900 text-xs uppercase font-semibold">
                  <th className="py-3 pr-4">Description</th>
                  <th className="py-3 text-center px-4">Qty</th>
                  <th className="py-3 text-right px-4">Rate</th>
                  <th className="py-3 text-right pl-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 pr-4 text-gray-800 font-medium">{item.description}</td>
                    <td className="py-4 text-gray-700 text-center px-4">{item.quantity}</td>
                    <td className="py-4 text-gray-700 text-right px-4">${Number(item.rate).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 text-gray-950 font-bold text-right pl-4">${Number(item.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mt-6 mb-8">
            <div className="w-72 text-sm space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>

              <Separator className="bg-gray-200" />

              <div className="flex justify-between text-base font-bold text-gray-950">
                <span>Total</span>
                <span>${invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-primary">
                <span>Balance Due</span>
                <span>${invoice.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Notes & Payment Instructions */}
          <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 border-t border-gray-200 pt-6">
            {invoice.notes && (
              <div>
                <p className="font-semibold text-gray-950 mb-1">Notes</p>
                <div className="whitespace-pre-line text-xs leading-relaxed">{invoice.notes}</div>
              </div>
            )}
            {invoice.paymentDetails && (
              <div>
                <p className="font-semibold text-gray-950 mb-1">Payment Instructions</p>
                <div className="whitespace-pre-line text-xs font-mono leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
                  {invoice.paymentDetails}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Pay Now Simulation Dialog */}
      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Pay Invoice {invoice.invoiceNumber}
            </DialogTitle>
            <DialogDescription>
              Select payment method to settle ${invoice.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "upi", label: "UPI / QR", icon: QrCode },
                { id: "card", label: "Credit Card", icon: CreditCard },
                { id: "netbanking", label: "NetBanking", icon: CheckCircle2 },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    payMethod === m.id ? "border-primary bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <m.icon className="h-4 w-4" />
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>

            {payMethod === "upi" && (
              <div className="p-4 bg-muted/40 rounded-xl text-center space-y-2 border">
                <p className="text-xs font-semibold text-muted-foreground">Scan with any UPI app</p>
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border flex items-center justify-center shadow-xs">
                  <QrCode className="w-24 h-24 text-primary" />
                </div>
                <p className="text-xs font-mono font-medium text-foreground">business@upi</p>
              </div>
            )}

            {payMethod === "card" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="4242 •••• •••• 4242" defaultValue="4242 •••• •••• 4242" className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="exp">Expiry</Label>
                    <Input id="exp" placeholder="MM/YY" defaultValue="12/28" className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" defaultValue="888" className="rounded-xl" />
                  </div>
                </div>
              </div>
            )}

            {payMethod === "netbanking" && (
              <div className="p-3 bg-muted/30 rounded-xl text-xs space-y-1 border">
                <p className="font-semibold text-foreground">Direct Bank Transfer</p>
                <p className="text-muted-foreground">Account: 9876543210 (SVB)</p>
                <p className="text-muted-foreground">IFSC / Swift: SVB0001234</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPayModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSimulatePayment} disabled={isProcessingPay} className="cursor-pointer bg-primary text-primary-foreground rounded-xl">
              {isProcessingPay ? "Processing..." : `Pay $${invoice.balanceDue.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
