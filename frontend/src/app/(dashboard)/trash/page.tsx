"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Trash2, Search, RefreshCw, Check, ArrowLeft } from "lucide-react"

export interface TrashItem {
  id: string
  client: string
  amount: number
  deletedAt: string
  type: string
}

const DEFAULT_MOCK_TRASH: TrashItem[] = [
  { id: "INV-0006", client: "LexCorp", amount: 9500.0, deletedAt: "2026-09-01", type: "invoice" },
  { id: "INV-0005", client: "Oscorp", amount: 150.0, deletedAt: "2026-08-15", type: "invoice" },
]

export default function TrashPage() {
  const [trash, setTrash] = useState<TrashItem[]>(DEFAULT_MOCK_TRASH)
  const [search, setSearch] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [emptyConfirmOpen, setEmptyConfirmOpen] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const loadTrash = useCallback(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("inkviz_trash")
      if (raw) {
        setTrash(JSON.parse(raw))
      } else {
        localStorage.setItem("inkviz_trash", JSON.stringify(DEFAULT_MOCK_TRASH))
        setTrash(DEFAULT_MOCK_TRASH)
      }
    } catch (e) {
      console.error("Failed to load trash", e)
    }
  }, [])

  useEffect(() => {
    loadTrash()
    const handleUpdate = () => loadTrash()
    window.addEventListener("inkviz_trash_updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("inkviz_trash_updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [loadTrash])

  const handleRestore = (item: TrashItem) => {
    if (typeof window === "undefined") return
    try {
      // 1. Remove from trash
      const updatedTrash = trash.filter((t) => t.id !== item.id)
      setTrash(updatedTrash)
      localStorage.setItem("inkviz_trash", JSON.stringify(updatedTrash))
      window.dispatchEvent(new Event("inkviz_trash_updated"))

      // 2. Add back to invoices
      if (item.type === "invoice") {
        const rawInvoices = localStorage.getItem("inkviz_invoices")
        const invoices = rawInvoices ? JSON.parse(rawInvoices) : []
        invoices.unshift({
          id: item.id,
          client: item.client,
          amount: item.amount,
          status: "draft",
          issueDate: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
          source: "Restored from Trash",
        })
        localStorage.setItem("inkviz_invoices", JSON.stringify(invoices))
        window.dispatchEvent(new Event("inkviz_invoices_updated"))
      }

      showToast(`Restored ${item.id} back to active records.`)
    } catch (e) {
      console.error("Failed to restore item", e)
    }
  }

  const handleDeleteForever = (id: string) => {
    if (typeof window === "undefined") return
    try {
      const updatedTrash = trash.filter((t) => t.id !== id)
      setTrash(updatedTrash)
      localStorage.setItem("inkviz_trash", JSON.stringify(updatedTrash))
      window.dispatchEvent(new Event("inkviz_trash_updated"))
      showToast(`Permanently removed ${id}.`)
    } catch (e) {
      console.error("Failed to delete forever", e)
    }
  }

  const handleEmptyTrash = () => {
    if (typeof window === "undefined") return
    try {
      setTrash([])
      localStorage.setItem("inkviz_trash", JSON.stringify([]))
      window.dispatchEvent(new Event("inkviz_trash_updated"))
      setEmptyConfirmOpen(false)
      showToast("Trash emptied completely.")
    } catch (e) {
      console.error("Failed to empty trash", e)
    }
  }

  const filteredTrash = trash.filter(
    (item) =>
      item.client.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 p-4 md:p-8 pt-6 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trash & Archive</h2>
          <p className="text-muted-foreground mt-1">
            Recover deleted invoices or remove them permanently. Items here are safe until deleted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Dashboard
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            disabled={trash.length === 0}
            onClick={() => setEmptyConfirmOpen(true)}
            className="cursor-pointer rounded-xl"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Empty Trash ({trash.length})
          </Button>
        </div>
      </div>

      <div className="relative w-full md:w-[400px]">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search trash by ID or client..."
          className="pl-9 w-full rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border bg-card/70 backdrop-blur overflow-x-auto shadow-xs">
        {filteredTrash.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Deleted Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTrash.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{item.id}</div>
                    <div className="text-muted-foreground text-xs">
                      {item.client} · ${Number(item.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="capitalize rounded-lg">
                      {item.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{item.deletedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(item)}
                        className="cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Restore
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteForever(item.id)}
                        className="cursor-pointer"
                      >
                        Delete Forever
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Trash2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Trash is empty</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[400px]">
              {search
                ? "No deleted items match your search query."
                : "Any deleted invoices or records will appear here so you can easily restore them at any time."}
            </p>
          </div>
        )}
      </div>

      {/* Empty Trash Confirmation Dialog */}
      <Dialog open={emptyConfirmOpen} onOpenChange={setEmptyConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Empty Trash?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete all {trash.length} items? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEmptyConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEmptyTrash}>
              Yes, Empty Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
