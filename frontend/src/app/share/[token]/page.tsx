"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { Download, CreditCard, Printer, CheckCircle2, ArrowLeft, Loader2, Building2, Globe } from "lucide-react"
import { invoicesApi } from "@/lib/api"
import { exportElementToPdf } from "@/lib/pdf-export"

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
  paymentDetails: "Bank: Silicon Valley Bank\nAccount: 9876543210\nRouting: 121000358\nSWIFT: SVB0US6S\nIBAN: US12SVB0000009876543210",
}

interface PageProps {
  params: Promise<{ token: string }>
}

export default function PublicSharePage({ params }: PageProps) {
  const resolvedParams = use(params)
  const token = resolvedParams?.token || "INV-0012"

  const [invoice, setInvoice] = useState(DEFAULT_SHARED_INVOICE)
  const [isLoading, setIsLoading] = useState(true)
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [payMethod, setPayMethod] = useState<"card" | "wire" | "paypal">("card")
  const [isProcessingPay, setIsProcessingPay] = useState(false)
  const [paidSuccess, setPaidSuccess] = useState(false)

  // Fetch live invoice from backend API with local fallback
  useEffect(() => {
    let isMounted = true

    const fetchLiveInvoice = async () => {
      setIsLoading(true)

      // 1. First attempt to load from backend API
      try {
        const live = await invoicesApi.getPublic(token)
        if (live && isMounted) {
          setInvoice({
            invoiceNumber: live.invoiceNumber || token,
            issueDate: live.issueDate ? new Date(live.issueDate).toISOString().split("T")[0] : "2026-09-04",
            dueDate: live.dueDate ? new Date(live.dueDate).toISOString().split("T")[0] : "2026-10-04",
            status: live.status || "published",
            client: {
              name: live.clientName || live.client?.name || "Client",
              email: live.clientEmail || live.client?.email || "",
              address: live.clientAddress || live.client?.address || "",
            },
            billFrom: {
              name: live.userId?.businessProfile?.companyName || live.userId?.name || "Inkviz Business",
              email: live.userId?.email || "",
              address: live.userId?.businessProfile?.address || "",
            },
            items: (live.items && live.items.length > 0)
              ? live.items.map((it: any, idx: number) => ({
                  id: it.id || String(idx + 1),
                  description: it.description || "Service",
                  quantity: Number(it.quantity) || 1,
                  rate: Number(it.rate || it.price) || 0,
                  amount: Number((it.quantity || 1) * (it.rate || it.price || 0)),
                }))
              : DEFAULT_SHARED_INVOICE.items,
            subtotal: Number(live.subtotal || live.totalAmount) || 0,
            taxAmount: Number(live.taxAmount) || 0,
            discountAmount: Number(live.discountAmount) || 0,
            shippingFee: Number(live.shippingFee) || 0,
            total: Number(live.totalAmount || live.subtotal) || 0,
            balanceDue: Number(live.balanceDue !== undefined ? live.balanceDue : (live.status === "paid" ? 0 : live.totalAmount)) || 0,
            notes: live.notes || "",
            paymentDetails: live.paymentDetails || "",
          })
          if (live.status === "paid") {
            setPaidSuccess(true)
          }
          setIsLoading(false)
          return
        }
      } catch (err) {
        // Fallback to local storage if offline or previewing locally
      }

      // 2. LocalStorage fallback
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("inkviz_invoices")
          if (raw) {
            const list = JSON.parse(raw)
            const found = list.find((i: any) => i.id === token || i._id === token)
            if (found && isMounted) {
              setInvoice((prev) => ({
                ...prev,
                invoiceNumber: found.id,
                client: {
                  name: found.client,
                  email: found.clientEmail || `${found.client.toLowerCase().replace(/\s+/g, "")}@example.com`,
                  address: found.clientAddress || "123 Client Blvd, Suite 200",
                },
                issueDate: found.issueDate || prev.issueDate,
                dueDate: found.dueDate || prev.dueDate,
                status: found.status,
                total: found.amount,
                subtotal: found.amount,
                balanceDue: found.status === "paid" ? 0 : found.amount,
                items: found.items && found.items.length > 0
                  ? found.items.map((it: any, idx: number) => ({
                      id: it.id || String(idx + 1),
                      description: it.description || "Service",
                      quantity: Number(it.quantity) || 1,
                      rate: Number(it.rate || it.price) || found.amount,
                      amount: Number((it.quantity || 1) * (it.rate || it.price || found.amount)),
                    }))
                  : [
                      {
                        id: "1",
                        description: found.source || "Professional Billing Services",
                        quantity: 1,
                        rate: found.amount,
                        amount: found.amount,
                      },
                    ],
              }))
              if (found.status === "paid") {
                setPaidSuccess(true)
              }
              setIsLoading(false)
              return
            }
          }
        } catch (e) {
          console.error("Failed to load shared invoice", e)
        }
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    fetchLiveInvoice()

    return () => {
      isMounted = false
    }
  }, [token])

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true)
    try {
      // First try client-side high-fidelity export of the rendered invoice
      const success = await exportElementToPdf("invoice-preview-container", {
        filename: `invoice-${invoice.invoiceNumber || "INV-0001"}.pdf`,
        scale: 2,
      })
      if (success) {
        setIsDownloadingPdf(false)
        return
      }

      // Fallback to backend PDF endpoint if DOM export failed
      const res = await invoicesApi.downloadPublicPdf(token)
      if (res && res.data) {
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${invoice.invoiceNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        return
      }
    } catch (e) {
      window.print()
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const handleSimulatePayment = () => {
    setIsProcessingPay(true)
    setTimeout(() => {
      setIsProcessingPay(false)
      setPaidSuccess(true)
      setPayModalOpen(false)

      // Update local invoice state
      setInvoice((prev) => ({
        ...prev,
        status: "paid",
        balanceDue: 0,
      }))

      // Persist in localStorage if found
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("inkviz_invoices")
          if (raw) {
            const list = JSON.parse(raw)
            const updated = list.map((i: any) => (i.id === token ? { ...i, status: "paid" } : i))
            localStorage.setItem("inkviz_invoices", JSON.stringify(updated))
            window.dispatchEvent(new Event("inkviz_invoices_updated"))
          }
        } catch (e) {}
      }
    }, 1200)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Loading invoice...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-background p-3.5 sm:p-4 rounded-2xl shadow-xs border print-hidden">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "text-xs h-9 rounded-xl" })}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Dashboard
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold flex items-center gap-2">
                Invoice {invoice.invoiceNumber}
                {invoice.status === "paid" && (
                  <span className="text-[10px] sm:text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                    PAID
                  </span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground">From {invoice.billFrom.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1 sm:flex-none cursor-pointer rounded-xl h-9 text-xs sm:text-sm">
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isDownloadingPdf}
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none cursor-pointer rounded-xl h-9 text-xs sm:text-sm"
            >
              {isDownloadingPdf ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-3.5 w-3.5" />
              )}
              PDF
            </Button>
            {invoice.status !== "paid" && (
              <Button size="sm" onClick={() => setPayModalOpen(true)} className="flex-1 sm:flex-none cursor-pointer rounded-xl h-9 text-xs sm:text-sm">
                <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Pay Now
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Paper */}
        <Card
          id="invoice-preview-container"
          className="bg-white text-black p-4 sm:p-8 md:p-12 shadow-lg min-h-[600px] flex flex-col mx-auto border-t-8 border-t-primary rounded-2xl relative overflow-hidden"
        >
          {/* Watermark for Paid */}
          {invoice.status === "paid" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
              <div className="border-8 border-emerald-600 text-emerald-600 font-extrabold text-5xl sm:text-7xl px-8 py-3 rounded-xl rotate-[-25deg] tracking-widest">
                PAID
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-1">INVOICE</h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 font-mono">#{invoice.invoiceNumber}</p>
            </div>
            <div className="sm:text-right text-xs sm:text-sm text-gray-600">
              <h2 className="font-bold text-base sm:text-lg text-gray-900 mb-1">{invoice.billFrom.name}</h2>
              <div className="whitespace-pre-line">{invoice.billFrom.address}</div>
              <div>{invoice.billFrom.email}</div>
            </div>
          </div>

          {/* Bill To & Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 border-b pb-6">
            <div className="text-xs sm:text-sm text-gray-600">
              <p className="font-semibold text-gray-900 mb-1 uppercase tracking-wider text-[11px]">Billed To:</p>
              <div className="font-bold text-gray-900 text-base">{invoice.client.name}</div>
              <div className="whitespace-pre-line">{invoice.client.address}</div>
              <div>{invoice.client.email}</div>
            </div>
            <div className="text-xs sm:text-sm w-full sm:w-auto">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:text-right">
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
          <div className="mt-2 flex-grow overflow-x-auto touch-scroll">
            <table className="w-full text-xs sm:text-sm text-left min-w-[480px]">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 text-gray-900 font-semibold w-full">Description</th>
                  <th className="py-3 text-gray-900 font-semibold text-center px-4">Qty</th>
                  <th className="py-3 text-gray-900 font-semibold text-right px-4">Rate</th>
                  <th className="py-3 text-gray-900 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3.5 text-gray-800">{item.description}</td>
                    <td className="py-3.5 text-gray-800 text-center px-4">{item.quantity}</td>
                    <td className="py-3.5 text-gray-800 text-right px-4">${item.rate.toFixed(2)}</td>
                    <td className="py-3.5 text-gray-900 font-medium text-right">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mt-6 mb-8">
            <div className="w-full sm:w-72 text-xs sm:text-sm">
              <div className="flex justify-between py-1 text-gray-600">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>

              <Separator className="my-2 bg-gray-200" />

              <div className="flex justify-between py-1 text-sm sm:text-base font-bold text-gray-900">
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 text-sm sm:text-base font-bold text-primary">
                <span>Balance Due</span>
                <span>${invoice.balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Payment Instructions */}
          <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 border-t pt-6">
            {invoice.notes && (
              <div>
                <p className="font-semibold text-gray-900 mb-1">Notes</p>
                <div className="whitespace-pre-line text-xs leading-relaxed">{invoice.notes}</div>
              </div>
            )}
            {invoice.paymentDetails && (
              <div>
                <p className="font-semibold text-gray-900 mb-1">Payment Instructions</p>
                <div className="whitespace-pre-line text-xs font-mono leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-200">
                  {invoice.paymentDetails}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Pay Now Simulation Dialog */}
      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Pay Invoice {invoice.invoiceNumber}
            </DialogTitle>
            <DialogDescription>
              Select your payment method to settle ${invoice.balanceDue.toFixed(2)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "card", label: "Credit Card", icon: CreditCard },
                { id: "wire", label: "Wire / ACH", icon: Building2 },
                { id: "paypal", label: "PayPal", icon: Globe },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id as any)}
                  className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    payMethod === m.id ? "border-primary bg-primary/5 font-semibold text-primary" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <m.icon className="h-4 w-4" />
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>

            {payMethod === "card" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="4242 •••• •••• 4242" defaultValue="4242 •••• •••• 4242" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="exp">Expiry</Label>
                    <Input id="exp" placeholder="MM/YY" defaultValue="12/28" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cvv">CVV / CVC</Label>
                    <Input id="cvv" placeholder="123" defaultValue="888" />
                  </div>
                </div>
              </div>
            )}

            {payMethod === "wire" && (
              <div className="p-3.5 bg-muted/30 rounded-lg text-xs space-y-2 border">
                <p className="font-semibold text-foreground">Direct International Wire & ACH Transfer</p>
                <div className="space-y-1 text-muted-foreground text-[11px]">
                  <div className="flex justify-between"><span className="font-medium text-foreground">Bank:</span> <span>Silicon Valley Bank</span></div>
                  <div className="flex justify-between"><span className="font-medium text-foreground">Account / IBAN:</span> <span className="font-mono">US12SVB0000009876543210</span></div>
                  <div className="flex justify-between"><span className="font-medium text-foreground">Routing / ABA:</span> <span className="font-mono">121000358</span></div>
                  <div className="flex justify-between"><span className="font-medium text-foreground">SWIFT / BIC:</span> <span className="font-mono">SVB0US6S</span></div>
                </div>
                <p className="text-[10px] text-muted-foreground italic pt-1 border-t">Include invoice number {invoice.invoiceNumber} as payment reference.</p>
              </div>
            )}

            {payMethod === "paypal" && (
              <div className="p-4 bg-muted/40 rounded-lg text-center space-y-3 border">
                <p className="text-xs font-semibold text-foreground">Express PayPal & Digital Wallet Checkout</p>
                <div className="p-3 bg-card border rounded-lg max-w-xs mx-auto text-left space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Beneficiary:</span> <span className="font-semibold">{invoice.billFrom.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Invoice Reference:</span> <span className="font-mono">{invoice.invoiceNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Payable:</span> <span className="font-bold text-foreground">${invoice.balanceDue.toFixed(2)}</span></div>
                </div>
                <p className="text-[11px] text-muted-foreground">Proceeding will redirect you to the secure PayPal gateway.</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPayModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSimulatePayment} disabled={isProcessingPay} className="cursor-pointer">
              {isProcessingPay ? "Processing..." : `Pay $${invoice.balanceDue.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
