"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { Save, Send, Download, Settings, Copy, Check, ExternalLink, ArrowLeft, Loader2 } from "lucide-react"
import { invoicesApi } from "@/lib/api"
import { exportElementToPdf } from "@/lib/pdf-export"

function InvoiceEditorWorkspace() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const { data, updateData } = useInvoice()

  const [isSaving, setIsSaving] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit")

  // If editId is provided in URL, load matching invoice from backend or localStorage
  useEffect(() => {
    if (!editId || typeof window === "undefined") return
    const fetchInvoice = async () => {
      try {
        const inv = await invoicesApi.get(editId)
        if (inv) {
          const loadedItems = (inv.items && inv.items.length > 0)
            ? inv.items.map((item: any, idx: number) => ({
                id: String(idx + 1),
                description: item.description,
                quantity: item.quantity,
                rate: item.price,
                amount: item.total || item.quantity * item.price,
                hsnCode: item.hsnCode || "",
                unit: item.unit || "Pcs",
                itemDiscount: 0,
              }))
            : [
                {
                  id: "1",
                  description: "Services / Deliverables",
                  quantity: 1,
                  rate: inv.totalAmount || 1000,
                  amount: inv.totalAmount || 1000,
                  hsnCode: "",
                  unit: "Pcs",
                  itemDiscount: 0,
                },
              ]

          updateData({
            invoiceNumber: inv.invoiceNumber || editId,
            client: {
              name: inv.clientName || "Client",
              email: inv.clientEmail || "client@example.com",
              address: inv.clientAddress || "123 Business Way, Suite 100",
            },
            items: loadedItems,
            issueDate: inv.issueDate ? new Date(inv.issueDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            watermarkStatus: inv.status === "paid" ? "PAID" : inv.status === "draft" ? "DRAFT" : null,
          })
          showToast(`Loaded invoice ${inv.invoiceNumber || editId}`)
          return
        }
      } catch (err) {
        // Fallback to local storage if API call fails
      }

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
                    hsnCode: "",
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
    }
    fetchInvoice()
  }, [editId])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const persistInvoice = async (status: "draft" | "published") => {
    // 1. Sync to backend API
    let backendInvoice: any = null
    try {
      const payload = {
        templateId: "6a99967f20362a95948ab737",
        clientName: data.client.name || "Walk-in Client",
        clientEmail: data.client.email || "client@example.com",
        clientAddress: data.client.address || "",
        items: data.items.map((item) => ({
          description: item.description || "Service item",
          quantity: Number(item.quantity) || 1,
          rate: Number(item.rate) || 0,
          price: Number(item.rate) || 0,
        })),
        taxRate: Number(data.taxRate) || 0,
        discountRate: data.discountType === "percentage" ? Number(data.discountValue) || 0 : 0,
        currency: data.currency || "USD",
        issueDate: data.issueDate ? new Date(data.issueDate).toISOString() : new Date().toISOString(),
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : new Date().toISOString(),
        notes: data.notes || "",
        status: status,
      }

      if (editId) {
        backendInvoice = await invoicesApi.update(editId, payload)
      } else {
        backendInvoice = await invoicesApi.create(payload)
      }
    } catch (apiErr) {
      console.warn("Backend API sync failed, saving locally:", apiErr)
    }

    // 2. Also persist locally for instant responsive UI & offline fallback
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("inkviz_invoices")
        const invoices = raw ? JSON.parse(raw) : []

        const record = {
          id: backendInvoice?.invoiceNumber || data.invoiceNumber || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          _id: backendInvoice?._id,
          client: data.client.name || "Walk-in Client",
          clientEmail: data.client.email,
          clientAddress: data.client.address,
          amount: backendInvoice?.totalAmount || data.total,
          status: status,
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          items: data.items,
          source: editId ? `Edited (${editId})` : "Cloud API",
        }

        const existingIndex = invoices.findIndex((i: any) => i.id === record.id || (record._id && i._id === record._id))
        if (existingIndex >= 0) {
          invoices[existingIndex] = { ...invoices[existingIndex], ...record }
        } else {
          invoices.unshift(record)
        }

        localStorage.setItem("inkviz_invoices", JSON.stringify(invoices))
        window.dispatchEvent(new Event("inkviz_invoices_updated"))
        return record
      } catch (e) {
        console.error("Failed to persist invoice locally", e)
      }
    }
    return null
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    updateData({ watermarkStatus: "DRAFT" })
    await persistInvoice("draft")
    showToast("Invoice saved as Draft in cloud!")
    setIsSaving(false)
    router.push("/dashboard")
  }

  const handlePublishAndSend = async () => {
    setIsSaving(true)
    updateData({ watermarkStatus: null })
    await persistInvoice("published")
    setIsSaving(false)
    setShareModalOpen(true)
  }

  const handleDownloadPDF = async () => {
    setIsExportingPdf(true)
    showToast("Generating PDF invoice...")
    try {
      const fileName = `invoice-${data.invoiceNumber || "INV-0001"}.pdf`
      const success = await exportElementToPdf("invoice-preview-container", {
        filename: fileName,
        scale: 2,
      })
      if (success) {
        showToast("PDF downloaded successfully!")
      } else {
        window.print()
      }
    } catch (e) {
      window.print()
    } finally {
      setIsExportingPdf(false)
    }
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
    <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden relative">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Action Bar Header */}
      <div className="flex flex-col border-b bg-background z-10 shrink-0 print-hidden">
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-muted-foreground hover:text-foreground shrink-0",
              })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold font-heading truncate">
                {editId ? `Edit (${editId})` : "New Invoice"}
              </h1>
              <p className="text-[11px] sm:text-xs text-muted-foreground hidden sm:block truncate">
                {data.invoiceNumber} · {data.currency}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              disabled={isExportingPdf}
              onClick={handleDownloadPDF}
              className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs rounded-xl cursor-pointer"
            >
              {isExportingPdf ? (
                <Loader2 className="h-3.5 w-3.5 sm:mr-1.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 sm:mr-1.5" />
              )}
              <span className="hidden sm:inline">
                {isExportingPdf ? "Generating..." : "Download"}
              </span>{" "}
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="hidden sm:inline-flex h-8 sm:h-9 px-3 text-xs rounded-xl cursor-pointer"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={handlePublishAndSend}
              disabled={isSaving}
              className="h-8 sm:h-9 px-3 text-xs font-semibold bg-primary text-primary-foreground rounded-xl shadow-xs cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Publish & Send</span>
              <span className="sm:hidden">Send</span>
            </Button>
          </div>
        </div>

        {/* Mobile View Segmented Toggle (Visible below lg) */}
        <div className="flex lg:hidden px-3 pb-2.5 pt-0.5">
          <div className="grid grid-cols-2 w-full p-1 bg-muted/80 rounded-xl">
            <button
              type="button"
              onClick={() => setMobileTab("edit")}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === "edit"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>📝 Edit Form</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === "preview"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>👁️ Live Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split Pane Workspace */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative print:overflow-visible print:block print:h-auto">
        {/* Left Pane - Form Editor (Scrollable) */}
        <div
          className={`overflow-y-auto p-3.5 sm:p-6 lg:p-8 bg-muted/30 border-r custom-scrollbar touch-scroll pb-24 lg:pb-32 print-hidden ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="max-w-2xl mx-auto">
            <InvoiceFormPanel />
          </div>
        </div>

        {/* Right Pane - Live Preview (Scrollable) */}
        <div
          className={`overflow-y-auto p-3 sm:p-6 lg:p-8 bg-muted/10 custom-scrollbar touch-scroll pb-24 lg:pb-32 print-force-show print:!block print:overflow-visible print:p-0 print:m-0 ${
            mobileTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="max-w-3xl mx-auto print:max-w-none print:w-full">
            <InvoicePreviewPanel />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Actions Bar (Below lg) */}
      <div className="lg:hidden sticky bottom-0 left-0 right-0 p-2.5 bg-background/95 backdrop-blur-md border-t z-20 flex items-center gap-2 shadow-lg print-hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveDraft}
          disabled={isSaving}
          className="flex-1 h-10 rounded-xl text-xs font-semibold cursor-pointer"
        >
          <Save className="h-4 w-4 mr-1.5" /> Save Draft
        </Button>
        <Button
          size="sm"
          onClick={handlePublishAndSend}
          disabled={isSaving}
          className="flex-1 h-10 bg-primary text-primary-foreground font-semibold rounded-xl text-xs shadow-md shadow-primary/20 cursor-pointer"
        >
          <Send className="h-4 w-4 mr-1.5" /> Publish & Send
        </Button>
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

              <Button
                variant="outline"
                size="sm"
                disabled={isExportingPdf}
                onClick={handleDownloadPDF}
                className="text-xs rounded-xl cursor-pointer"
              >
                {isExportingPdf ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                )}
                {isExportingPdf ? "Exporting..." : "Download PDF"}
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
