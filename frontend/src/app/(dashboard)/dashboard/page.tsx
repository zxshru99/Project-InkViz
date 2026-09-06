"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FilePlus2,
  Clock,
  CheckCircle2,
  FileText,
  TrendingUp,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Search,
  Check,
  CopyPlus,
} from "lucide-react"

import { invoicesApi } from "@/lib/api"

export interface InvoiceRecord {
  id: string
  _id?: string
  client: string
  amount: number
  status: "published" | "draft" | "paid" | "overdue" | "archived"
  issueDate: string
  dueDate: string
  source?: string
}


const STATUS_STYLE: Record<string, string> = {
  published: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  paid:      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  overdue:   "bg-red-500/10 text-red-700 dark:text-red-300",
  draft:     "bg-muted text-muted-foreground",
  archived:  "bg-muted text-muted-foreground",
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const loadInvoices = async () => {
    try {
      const res = await invoicesApi.list({ limit: 50 })
      if (res && res.invoices) {
        const backendRecords: InvoiceRecord[] = res.invoices.map((inv: any) => ({
          id: inv.invoiceNumber || inv._id,
          _id: inv._id,
          client: inv.clientName || "Client",
          amount: inv.totalAmount || inv.subtotal || 0,
          status: (inv.status === "sent" ? "published" : inv.status) || "published",
          issueDate: inv.issueDate ? new Date(inv.issueDate).toISOString().split("T")[0] : "",
          dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().split("T")[0] : "",
          source: "Cloud API",
        }))
        setInvoices(backendRecords)
        if (typeof window !== "undefined") {
          localStorage.setItem("inkviz_invoices", JSON.stringify(backendRecords))
        }
        setIsLoading(false)
        return
      }
    } catch (e) {
      // offline fallback below
    }

    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }
    try {
      const raw = localStorage.getItem("inkviz_invoices")
      if (raw !== null) {
        const parsed = JSON.parse(raw)
        setInvoices(Array.isArray(parsed) ? parsed : [])
      } else {
        // New user starts clean with 0 invoices
        setInvoices([])
      }
    } catch (e) {
      setInvoices([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInvoices()
    const handleUpdate = () => loadInvoices()
    window.addEventListener("inkviz_invoices_updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("inkviz_invoices_updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [])

  const metrics = useMemo(() => {
    const outstanding = invoices
      .filter((i) => i.status === "published" || i.status === "overdue")
      .reduce((s, i) => s + i.amount, 0)
    const paid = invoices
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + i.amount, 0)
    const draftCount = invoices.filter((i) => i.status === "draft").length
    const overdueCount = invoices.filter((i) => i.status === "overdue").length
    const totalVolume = invoices.reduce((s, i) => s + i.amount, 0)
    return { outstanding, paid, draftCount, overdueCount, totalVolume, totalCount: invoices.length }
  }, [invoices])

  const handleMoveToTrash = async (inv: InvoiceRecord) => {
    try {
      if (inv._id || inv.id) await invoicesApi.delete(inv._id || inv.id)
    } catch (apiErr) {
      console.warn("Backend soft-delete failed:", apiErr)
    }
    if (typeof window === "undefined") return
    try {
      const currentInvoices = invoices.filter((i) => i.id !== inv.id)
      setInvoices(currentInvoices)
      localStorage.setItem("inkviz_invoices", JSON.stringify(currentInvoices))
      window.dispatchEvent(new Event("inkviz_invoices_updated"))
      const rawTrash = localStorage.getItem("inkviz_trash")
      const trashList = rawTrash ? JSON.parse(rawTrash) : []
      trashList.unshift({
        id: inv.id, _id: inv._id, client: inv.client, amount: inv.amount,
        deletedAt: new Date().toISOString().split("T")[0], type: "invoice",
      })
      localStorage.setItem("inkviz_trash", JSON.stringify(trashList))
      window.dispatchEvent(new Event("inkviz_trash_updated"))
      showToast(`Invoice ${inv.id} moved to Trash.`)
    } catch (e) {
      console.error("Failed to move to trash", e)
    }
  }

  const handleCopyLink = (id: string) => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/share/${encodeURIComponent(id)}`
      navigator.clipboard.writeText(shareUrl)
      showToast(`Share link for ${id} copied!`)
    }
  }

  const handleDuplicate = async (inv: InvoiceRecord) => {
    try {
      if (inv._id || inv.id) {
        const dup = await invoicesApi.duplicate(inv._id || inv.id)
        if (dup) {
          showToast(`Duplicated as ${dup.invoiceNumber}`)
          loadInvoices()
          return
        }
      }
    } catch (e) {
      console.warn("Backend duplicate failed:", e)
    }
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("inkviz_invoices")
      const list = raw ? JSON.parse(raw) : []
      const newId = `INV-${Math.floor(1000 + Math.random() * 9000)}`
      list.unshift({
        ...inv, id: newId, _id: undefined, status: "draft",
        issueDate: new Date().toISOString().split("T")[0], source: "Duplicated",
      })
      localStorage.setItem("inkviz_invoices", JSON.stringify(list))
      window.dispatchEvent(new Event("inkviz_invoices_updated"))
      showToast(`Duplicated as ${newId}`)
    }
  }

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab !== "all" && inv.status !== activeTab) return false
    if (
      search &&
      !inv.client.toLowerCase().includes(search.toLowerCase()) &&
      !inv.id.toLowerCase().includes(search.toLowerCase())
    ) return false
    return true
  })

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-2.5 rounded-xl shadow-xl text-[12px] font-mono tracking-wide flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-200">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mono-badge inline-block mb-2">Workspace</div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-[-0.03em] text-foreground">
            Dashboard
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Manage invoices, track balances, and send payment links.
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="w-full sm:w-auto h-9 px-5 text-[11px] font-semibold tracking-[0.1em] uppercase rounded-full bg-foreground text-background hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New Invoice
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Outstanding",
            value: `$${fmt(metrics.outstanding)}`,
            sub: metrics.overdueCount > 0 ? `${metrics.overdueCount} overdue` : "Awaiting payment",
            icon: <Clock className="h-4 w-4" />,
            accent: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Collected",
            value: `$${fmt(metrics.paid)}`,
            sub: "Settled payments",
            icon: <CheckCircle2 className="h-4 w-4" />,
            accent: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Drafts",
            value: String(metrics.draftCount),
            sub: "Unpublished",
            icon: <FileText className="h-4 w-4" />,
            accent: "text-foreground",
          },
          {
            label: "Total Invoiced",
            value: `$${fmt(metrics.totalVolume)}`,
            sub: `${metrics.totalCount} invoices`,
            icon: <TrendingUp className="h-4 w-4" />,
            accent: "text-foreground",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bento-card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-muted-foreground">
                {kpi.label}
              </span>
              <div className={`${kpi.accent} opacity-60`}>{kpi.icon}</div>
            </div>
            <div className={`text-xl sm:text-2xl font-light tracking-[-0.03em] ${kpi.accent}`}>
              {kpi.value}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 font-mono">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex overflow-x-auto scrollbar-none gap-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          {["all", "draft", "published", "paid", "overdue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-[0.1em] uppercase whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search client or invoice #..."
            className="w-full h-9 pl-9 pr-4 text-[13px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Invoice List */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        {filteredInvoices.length > 0 ? (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden divide-y divide-border/40">
              {filteredInvoices.map((inv) => (
                <div key={inv.id} className="p-4 space-y-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/invoices/new?id=${encodeURIComponent(inv.id)}`}
                      className="flex items-center gap-2 text-[13px] font-semibold text-foreground hover:underline underline-offset-4"
                    >
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      {inv.id}
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                          STATUS_STYLE[inv.status] || ""
                        }`}
                      >
                        {inv.status.toUpperCase()}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors text-muted-foreground">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl text-[13px]">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/invoices/new?id=${encodeURIComponent(inv.id)}`}
                              className="cursor-pointer"
                            >
                              View / Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/share/${encodeURIComponent(inv.id)}`}
                              target="_blank"
                              className="cursor-pointer flex items-center gap-2"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                              Public View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCopyLink(inv.id)}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            Copy Share Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(inv)}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <CopyPlus className="h-3.5 w-3.5 text-muted-foreground" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleMoveToTrash(inv)}
                            className="text-destructive cursor-pointer flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Move to Trash
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[14px] font-medium text-foreground">{inv.client}</p>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                        Due {inv.dueDate || "N/A"}
                      </p>
                    </div>
                    <span className="text-[16px] font-light tracking-[-0.02em] text-foreground">
                      ${fmt(inv.amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <Link
                      href={`/invoices/new?id=${encodeURIComponent(inv.id)}`}
                      className="flex-1 h-8 text-[11px] font-semibold tracking-wide rounded-lg border border-border text-foreground hover:bg-foreground/5 transition-colors flex items-center justify-center"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/share/${encodeURIComponent(inv.id)}`}
                      target="_blank"
                      className="flex-1 h-8 text-[11px] font-semibold tracking-wide rounded-lg border border-border text-foreground hover:bg-foreground/5 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Link>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Hello ${inv.client}, here is your invoice ${inv.id} for $${Number(inv.amount).toFixed(2)} (Due: ${inv.dueDate}). View: ${
                          typeof window !== "undefined" ? window.location.origin : ""
                        }/share/${encodeURIComponent(inv.id)}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-[11px] font-semibold flex items-center gap-1"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      WA
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-border/60">
                  <tr>
                    {[
                      { label: "Invoice No.", align: "" },
                      { label: "Client", align: "" },
                      { label: "Issue Date", align: "" },
                      { label: "Due Date", align: "" },
                      { label: "Amount", align: "text-right" },
                      { label: "Status", align: "" },
                      { label: "", align: "" },
                    ].map((h) => (
                      <th
                        key={h.label}
                        className={`px-5 py-3.5 text-[10px] font-mono tracking-[0.18em] uppercase text-muted-foreground font-medium ${h.align}`}
                      >
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-5 py-4">
                        <Link
                          href={`/invoices/new?id=${encodeURIComponent(inv.id)}`}
                          className="text-[13px] font-semibold text-foreground hover:underline underline-offset-4 flex items-center gap-2"
                        >
                          <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {inv.id}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-foreground">
                        {inv.client}
                      </td>
                      <td className="px-5 py-4 text-[12px] font-mono text-muted-foreground">
                        {inv.issueDate}
                      </td>
                      <td className="px-5 py-4 text-[12px] font-mono text-muted-foreground">
                        {inv.dueDate}
                      </td>
                      <td className="px-5 py-4 text-right text-[13px] font-light tracking-[-0.01em] text-foreground">
                        ${fmt(inv.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full font-semibold ${
                            STATUS_STYLE[inv.status] || ""
                          }`}
                        >
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors text-muted-foreground opacity-0 group-hover:opacity-100 ml-auto">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl text-[13px]">
                            <DropdownMenuLabel className="text-[11px] font-mono tracking-wider uppercase text-muted-foreground">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/invoices/new?id=${encodeURIComponent(inv.id)}`}
                                className="cursor-pointer"
                              >
                                View / Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/share/${encodeURIComponent(inv.id)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer flex items-center gap-2"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                Public View &amp; Print
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCopyLink(inv.id)}
                              className="cursor-pointer flex items-center gap-2"
                            >
                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              Copy Share Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(inv)}
                              className="cursor-pointer flex items-center gap-2"
                            >
                              <CopyPlus className="h-3.5 w-3.5 text-muted-foreground" />
                              Duplicate Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                  `Hello ${inv.client}, here is your invoice ${inv.id} for $${Number(inv.amount).toFixed(2)} (Due: ${inv.dueDate}). Pay securely: ${
                                    typeof window !== "undefined" ? window.location.origin : ""
                                  }/share/${encodeURIComponent(inv.id)}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 cursor-pointer text-emerald-600 dark:text-emerald-400"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                Share via WhatsApp
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleMoveToTrash(inv)}
                              className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Move to Trash
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center mb-4 text-muted-foreground">
              <FilePlus2 className="h-5 w-5" />
            </div>
            <h3 className="text-[15px] font-medium text-foreground">No invoices found</h3>
            <p className="text-[13px] text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
              {search
                ? "No invoices match your search. Try adjusting the filter."
                : "You don't have any invoices yet. Create your first one now."}
            </p>
            {!search && (
              <Link
                href="/invoices/new"
                className="mt-6 h-9 px-5 text-[11px] font-semibold tracking-[0.1em] uppercase rounded-full bg-foreground text-background hover:opacity-80 transition-opacity flex items-center gap-2"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                Create Invoice
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
