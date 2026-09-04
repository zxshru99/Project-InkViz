"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

export interface InvoiceRecord {
  id: string
  client: string
  amount: number
  status: "published" | "draft" | "paid" | "overdue" | "archived"
  issueDate: string
  dueDate: string
  source?: string
}

const DEFAULT_INVOICES: InvoiceRecord[] = [
  { id: "INV-0012", client: "Acme Corp", amount: 1250.0, status: "published", issueDate: "2026-09-04", dueDate: "2026-10-04" },
  { id: "INV-0011", client: "Globex Inc", amount: 850.5, status: "draft", issueDate: "2026-09-02", dueDate: "2026-10-02" },
  { id: "INV-0010", client: "Soylent Corp", amount: 3200.0, status: "paid", issueDate: "2026-08-28", dueDate: "2026-09-28" },
  { id: "INV-0009", client: "Initech", amount: 450.0, status: "overdue", issueDate: "2026-08-15", dueDate: "2026-08-30" },
  { id: "INV-0008", client: "Stark Industries", amount: 12500.0, status: "paid", issueDate: "2026-08-01", dueDate: "2026-08-15" },
]

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(DEFAULT_INVOICES)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const loadInvoices = () => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("inkviz_invoices")
      if (raw) {
        const parsed = JSON.parse(raw)
        const combined = [...parsed]
        DEFAULT_INVOICES.forEach((def) => {
          if (!combined.some((c) => c.id === def.id)) {
            combined.push(def)
          }
        })
        setInvoices(combined)
      } else {
        localStorage.setItem("inkviz_invoices", JSON.stringify(DEFAULT_INVOICES))
        setInvoices(DEFAULT_INVOICES)
      }
    } catch (e) {
      console.error("Failed to load invoices", e)
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

  // Dynamic KPI calculations
  const metrics = useMemo(() => {
    const outstanding = invoices
      .filter((i) => i.status === "published" || i.status === "overdue")
      .reduce((sum, i) => sum + i.amount, 0)

    const paid = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0)

    const draftCount = invoices.filter((i) => i.status === "draft").length
    const overdueCount = invoices.filter((i) => i.status === "overdue").length
    const totalVolume = invoices.reduce((sum, i) => sum + i.amount, 0)

    return {
      outstanding,
      paid,
      draftCount,
      overdueCount,
      totalVolume,
      totalCount: invoices.length,
    }
  }, [invoices])

  const handleMoveToTrash = (inv: InvoiceRecord) => {
    if (typeof window === "undefined") return
    try {
      const currentInvoices = invoices.filter((i) => i.id !== inv.id)
      setInvoices(currentInvoices)
      localStorage.setItem("inkviz_invoices", JSON.stringify(currentInvoices))
      window.dispatchEvent(new Event("inkviz_invoices_updated"))

      const rawTrash = localStorage.getItem("inkviz_trash")
      const trashList = rawTrash ? JSON.parse(rawTrash) : []
      trashList.unshift({
        id: inv.id,
        client: inv.client,
        amount: inv.amount,
        deletedAt: new Date().toISOString().split("T")[0],
        type: "invoice",
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

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab !== "all" && inv.status !== activeTab) return false
    if (
      search &&
      !inv.client.toLowerCase().includes(search.toLowerCase()) &&
      !inv.id.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="space-y-8 p-4 md:p-8 pt-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Manage your invoices, track outstanding balances, and send payment links.
          </p>
        </div>
        <Link href="/invoices/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-xs cursor-pointer font-semibold px-5 py-2.5">
            <FilePlus2 className="mr-2 h-4 w-4" /> Create invoice
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-xs hover:shadow-sm transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding</CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">
              ${metrics.outstanding.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.overdueCount > 0 ? `${metrics.overdueCount} overdue invoices` : "Awaiting payment"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-xs hover:shadow-sm transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid & Collected</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">
              ${metrics.paid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Settled payments</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-xs hover:shadow-sm transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{metrics.draftCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending publication</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-xs hover:shadow-sm transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">
              ${metrics.totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across {metrics.totalCount} invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {["all", "draft", "published", "paid", "overdue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by client or invoice #..."
            className="pl-9 w-full md:w-[320px] rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border bg-card/70 backdrop-blur overflow-hidden shadow-xs">
        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Invoice No.</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <Link href={`/invoices/new?id=${encodeURIComponent(inv.id)}`} className="hover:underline text-primary">
                        {inv.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium">{inv.client}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{inv.issueDate}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{inv.dueDate}</td>
                    <td className="px-6 py-4 text-right font-bold font-heading">
                      ${Number(inv.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          inv.status === "published"
                            ? "default"
                            : inv.status === "paid"
                            ? "secondary"
                            : inv.status === "overdue"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          inv.status === "published"
                            ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20"
                            : inv.status === "paid"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                            : inv.status === "overdue"
                            ? "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20"
                            : ""
                        }
                      >
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 cursor-pointer opacity-70 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/invoices/new?id=${encodeURIComponent(inv.id)}`} className="cursor-pointer">
                              View / Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/share/${encodeURIComponent(inv.id)}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center">
                              <ExternalLink className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                              Public View & Print
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCopyLink(inv.id)}
                            className="cursor-pointer flex items-center"
                          >
                            <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            Copy Share Link
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                `Hello ${inv.client}, here is your invoice ${inv.id} for $${Number(inv.amount).toFixed(2)} (Due: ${inv.dueDate}). Pay securely online: ${
                                  typeof window !== "undefined" ? window.location.origin : "https://inkviz.app"
                                }/share/${encodeURIComponent(inv.id)}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 cursor-pointer text-emerald-600 focus:text-emerald-600 font-medium"
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
                            className="text-destructive focus:text-destructive cursor-pointer flex items-center"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted p-4 rounded-2xl mb-4">
              <FilePlus2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No invoices found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-[400px]">
              {search
                ? "We couldn't find any invoices matching your search. Try adjusting your filter."
                : "You don't have any invoices in this category yet. Create your first invoice now."}
            </p>
            {!search && (
              <Link href="/invoices/new" className="mt-5">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-xs font-semibold">
                  <FilePlus2 className="mr-2 h-4 w-4" /> Create invoice
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
