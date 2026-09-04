"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { InvoiceProvider, useInvoice } from "@/components/invoice-editor/InvoiceContext"
import { InvoiceFormPanel } from "@/components/invoice-editor/InvoiceFormPanel"
import { InvoicePreviewPanel } from "@/components/invoice-editor/InvoicePreviewPanel"
import { Save, Send, Download, Settings, Copy, Check, ExternalLink, ArrowLeft } from "lucide-react"

function InvoiceEditorWorkspace() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const { data, updateData } = useInvoice()

  const [isSaving, setIsSaving] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit")

  // If editId is provided in URL, load matching invoice from localStorage
  useEffect(() => {
    if (!editId || typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("inkviz_invoices")
      if (raw) {
        const invoices = JSON.parse(raw)
        const match = invoices.find((inv: any) => inv.id === editId || inv.id === decodeURIComponent(editId))
        if (match) {
          const loadedItems = (match.items && match.items.length > 0)
            ? match.items
            : [
                {
                  id: "1",
                  description: match.source || "Services / Deliverables",
                  quantity: 1,
                  rate: match.amount || 1000,
                  amount: match.amount || 1000,
                  hsnCode: "9983",
                  unit: "Pcs",
                  itemDiscount: 0,
                },
              ]

          updateData({
            invoiceNumber: match.id,
            client: {
              name: match.client,
              email: match.clientEmail || `${match.client.toLowerCase().replace(/\s+/g, "")}@example.com`,
              address: match.clientAddress || "123 Business Way, Suite 100",
            },
            items: loadedItems,
            issueDate: match.issueDate || new Date().toISOString().split("T")[0],
            dueDate: match.dueDate || new Date().toISOString().split("T")[0],
            watermarkStatus: match.status === "paid" ? "PAID" : match.status === "draft" ? "DRAFT" : null,
          })
          showToast(`Loaded invoice ${match.id}`)
        }
      }
    } catch (e) {
      console.error("Failed to load invoice for editing", e)
    }
  }, [editId])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const persistInvoice = (status: "draft" | "published") => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("inkviz_invoices")
      const invoices = raw ? JSON.parse(raw) : []

      const record = {
        id: data.invoiceNumber || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        client: data.client.name || "Walk-in Client",
        clientEmail: data.client.email,
        clientAddress: data.client.address,
        amount: data.total,
        status: status,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        items: data.items,
        source: editId ? `Edited (${editId})` : "Manual Entry",
      }

      const existingIndex = invoices.findIndex((i: any) => i.id === record.id)
      if (existingIndex >= 0) {
        invoices[existingIndex] = { ...invoices[existingIndex], ...record }
      } else {
        invoices.unshift(record)
      }

      localStorage.setItem("inkviz_invoices", JSON.stringify(invoices))
      window.dispatchEvent(new Event("inkviz_invoices_updated"))
      return record
    } catch (e) {
      console.error("Failed to persist invoice", e)
      return null
    }
  }

  const handleSaveDraft = () => {
    setIsSaving(true)
    updateData({ watermarkStatus: "DRAFT" })
    persistInvoice("draft")
    showToast("Invoice saved as Draft!")
    setTimeout(() => {
      setIsSaving(false)
      router.push("/dashboard")
    }, 600)
  }

  const handlePublishAndSend = () => {
    setIsSaving(true)
    updateData({ watermarkStatus: null })
    persistInvoice("published")
    setIsSaving(false)
    setShareModalOpen(true)
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  const encodedId = encodeURIComponent(data.invoiceNumber || "INV-0001")
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${encodedId}`
      : `https://inkviz.app/share/${encodedId}`

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 bg-background z-10 shrink-0 print-hidden">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold font-heading">{editId ? `Edit Invoice (${editId})` : "New Invoice"}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {data.invoiceNumber} · {data.currency}
            </p>
          </div>
        </div>

        {/* Mobile View Toggle (Visible only below lg) */}
        <div className="flex lg:hidden bg-muted p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMobileTab("edit")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === "edit" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === "preview" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            className="cursor-pointer rounded-xl"
          >
            <Download className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Download</span> PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="cursor-pointer rounded-xl"
          >
            <Save className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Save</span> Draft
          </Button>
          <Button
            size="sm"
            onClick={handlePublishAndSend}
            disabled={isSaving}
            className="cursor-pointer bg-primary text-primary-foreground font-semibold rounded-xl"
          >
            <Send className="h-4 w-4 mr-1.5" />
            Publish & Send
          </Button>
        </div>
      </div>

      {/* Split Pane Workspace */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative">
        {/* Left Pane - Form Editor (Scrollable) */}
        <div
          className={`overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/30 border-r custom-scrollbar pb-32 print-hidden ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="max-w-2xl mx-auto">
            <InvoiceFormPanel />
          </div>
        </div>

        {/* Right Pane - Live Preview (Scrollable) */}
        <div
          className={`overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/10 custom-scrollbar pb-32 ${
            mobileTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <InvoicePreviewPanel />
          </div>
        </div>
      </div>

      {/* Publish & Send Success Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="h-5 w-5" /> Invoice Published Successfully!
            </DialogTitle>
            <DialogDescription>
              Your invoice #{data.invoiceNumber} is live and ready to be shared with {data.client.name || "your client"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Public Share Link</label>
              <div className="flex gap-2">
                <Input readOnly value={shareUrl} className="font-mono text-xs bg-muted rounded-xl" />
                <Button variant="secondary" size="sm" onClick={copyToClipboard} className="shrink-0 rounded-xl">
                  {copiedLink ? <Check className="h-4 w-4 mr-1 text-emerald-600" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copiedLink ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Hello ${data.client.name || "there"}, here is your invoice #${data.invoiceNumber} for ${data.currency} ${data.total.toFixed(2)}. Pay online: ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs rounded-xl">
                  <svg className="w-3.5 h-3.5 mr-1.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  WhatsApp
                </Button>
              </a>

              <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs rounded-xl">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Print / PDF
              </Button>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full sm:w-auto rounded-xl">
              Back to Dashboard
            </Button>
            <Link href={`/share/${encodedId}`} target="_blank" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-xl bg-primary text-primary-foreground font-semibold">
                <ExternalLink className="h-4 w-4 mr-1.5" /> Open Public View
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function NewInvoicePage() {
  return (
    <InvoiceProvider>
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Invoice Editor...</div>}>
        <InvoiceEditorWorkspace />
      </Suspense>
    </InvoiceProvider>
  )
}
