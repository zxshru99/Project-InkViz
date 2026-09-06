"use client"

import { useState, useEffect, useCallback } from 'react'

export interface QuoteItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  hsnCode?: string
  unit: string
}

export interface Quotation {
  id: string
  quoteNumber: string
  client: {
    name: string
    email: string
    phone?: string
    address?: string
  }
  issueDate: string
  expiryDate: string
  items: QuoteItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  currency: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired'
  convertedInvoiceId?: string
  notes?: string
  createdAt: string
}

export interface ProformaInvoice {
  id: string
  proformaNumber: string
  poNumber?: string
  client: {
    name: string
    email: string
    address?: string
  }
  issueDate: string
  dueDate: string
  total: number
  advanceRequired: number
  advancePaid: number
  balanceDue: number
  currency: string
  status: 'Pending Advance' | 'Advance Received' | 'Converted to Invoice'
  convertedInvoiceId?: string
  notes?: string
  createdAt: string
}

export interface ChallanItem {
  id: string
  description: string
  quantity: number
  unit: string
  hsnCode?: string
}

export interface DeliveryChallan {
  id: string
  challanNumber: string
  dispatchDate: string
  client: {
    name: string
    address: string
    contactPhone?: string
  }
  transporterName: string
  vehicleNumber: string
  ewayBillNumber: string
  purpose: 'Supply of Goods' | 'Job Work' | 'Exhibition' | 'Returnable Goods'
  totalPackages: number
  totalWeightKg?: number
  items: ChallanItem[]
  status: 'In Transit' | 'Delivered' | 'Returned'
  convertedInvoiceId?: string
  createdAt: string
}

export interface CreditNote {
  id: string
  creditNoteNumber: string
  originalInvoiceNumber: string
  client: {
    name: string
    email: string
  }
  issueDate: string
  reason: 'Defective Goods Return' | 'Price Difference / Rebate' | 'Order Cancellation' | 'Post-Sale Discount'
  creditAmount: number
  taxAdjustment: number
  totalCredit: number
  currency: string
  status: 'Open' | 'Adjusted against Invoice' | 'Refunded'
  createdAt: string
}

// Seed Records for Quotations
export const DEFAULT_QUOTATIONS: Quotation[] = [
  {
    id: 'quote-1',
    quoteNumber: 'EST/2026/001',
    client: {
      name: 'Nexus Global Tech Inc.',
      email: 'billing@nexusglobaltech.io',
      phone: '+1 (415) 555-0192',
      address: '500 Howard St, Suite 400, San Francisco, CA 94105'
    },
    issueDate: '2026-02-15',
    expiryDate: '2026-03-15',
    items: [
      { id: '1', description: 'Cloud Infrastructure & DevOps Setup', quantity: 1, rate: 4500, amount: 4500, hsnCode: 'DEV-001', unit: 'Hrs' },
      { id: '2', description: 'Full-Stack Web Application Development', quantity: 1, rate: 8500, amount: 8500, hsnCode: 'FULL-002', unit: 'Flat' }
    ],
    subtotal: 13000,
    taxRate: 10,
    taxAmount: 1300,
    total: 14300,
    currency: 'USD',
    status: 'Sent',
    notes: 'Quotation valid for 30 days. Standard payment terms apply.',
    createdAt: '2026-02-15T09:00:00.000Z'
  },
  {
    id: 'quote-2',
    quoteNumber: 'EST/2026/002',
    client: {
      name: 'Global LogiTrans Corp',
      email: 'procurement@logitrans.com',
      phone: '+1 (212) 555-0143',
      address: '120 Broadway, 18th Floor, New York, NY 10271'
    },
    issueDate: '2026-02-20',
    expiryDate: '2026-03-05',
    items: [
      { id: '1', description: 'Ergonomic Executive Office Chair', quantity: 12, rate: 350, amount: 4200, hsnCode: 'CHAIR-EXEC', unit: 'Pcs' }
    ],
    subtotal: 4200,
    taxRate: 8.875,
    taxAmount: 372.75,
    total: 4572.75,
    currency: 'USD',
    status: 'Accepted',
    convertedInvoiceId: 'INV/2026/0042',
    notes: 'Bulk corporate discount applied.',
    createdAt: '2026-02-20T11:30:00.000Z'
  },
  {
    id: 'quote-3',
    quoteNumber: 'EST/2026/003',
    client: {
      name: 'Apex HyperScale Analytics Ltd',
      email: 'accounts@apexhs.com',
      phone: '+44 20 7946 0912',
      address: '10 Finsbury Square, London EC2A 1AF, United Kingdom'
    },
    issueDate: '2026-01-10',
    expiryDate: '2026-01-25',
    items: [
      { id: '1', description: 'UI/UX Design System & Mobile App Mockups', quantity: 1, rate: 3200, amount: 3200, hsnCode: 'UIUX-001', unit: 'Days' }
    ],
    subtotal: 3200,
    taxRate: 20,
    taxAmount: 640,
    total: 3840,
    currency: 'USD',
    status: 'Expired',
    notes: 'Estimate expired on Jan 25, 2026.',
    createdAt: '2026-01-10T14:15:00.000Z'
  }
]

// Seed Records for Proforma Invoices
export const DEFAULT_PROFORMA: ProformaInvoice[] = [
  {
    id: 'pi-1',
    proformaNumber: 'PI/2026/001',
    poNumber: 'PO-APX-9821',
    client: {
      name: 'Kallisto Technologies Inc',
      email: 'finance@kallistotech.com',
      address: '400 Concar Dr, San Mateo, CA 94402, USA'
    },
    issueDate: '2026-02-18',
    dueDate: '2026-03-04',
    total: 28000,
    advanceRequired: 14000,
    advancePaid: 14000,
    balanceDue: 14000,
    currency: 'USD',
    status: 'Advance Received',
    notes: '50% advance received via SWIFT wire transfer. Production initiated.',
    createdAt: '2026-02-18T10:00:00.000Z'
  },
  {
    id: 'pi-2',
    proformaNumber: 'PI/2026/002',
    poNumber: 'PO-ZTH-4410',
    client: {
      name: 'Zenith Retail Chain LLC',
      email: 'ap@zenithretail.com',
      address: '200 S Michigan Ave, Chicago, IL 60604, USA'
    },
    issueDate: '2026-02-24',
    dueDate: '2026-03-10',
    total: 9500,
    advanceRequired: 4750,
    advancePaid: 0,
    balanceDue: 9500,
    currency: 'USD',
    status: 'Pending Advance',
    notes: 'Advance payment of 50% required before batch dispatch.',
    createdAt: '2026-02-24T12:00:00.000Z'
  }
]

// Seed Records for Delivery Challans / Notes
export const DEFAULT_CHALLANS: DeliveryChallan[] = [
  {
    id: 'dc-1',
    challanNumber: 'DN/2026/001',
    dispatchDate: '2026-02-22',
    client: {
      name: 'Zenith Retail Distribution Hub',
      address: '450 Logistics Way, Suite 10, Dallas, TX 75201',
      contactPhone: '+1 (214) 555-0188'
    },
    transporterName: 'FedEx Freight Direct',
    vehicleNumber: 'TRK-9821-US',
    ewayBillNumber: 'BOL-3410982746',
    purpose: 'Supply of Goods',
    totalPackages: 15,
    totalWeightKg: 180,
    items: [
      { id: '1', description: 'Ergonomic Executive Office Chair', quantity: 10, unit: 'Pcs', hsnCode: 'CHAIR-EXEC' },
      { id: '2', description: 'Samsung 990 PRO 2TB NVMe PCIe 4.0 SSD', quantity: 5, unit: 'Pcs', hsnCode: 'SSD-2TB' }
    ],
    status: 'In Transit',
    createdAt: '2026-02-22T08:30:00.000Z'
  },
  {
    id: 'dc-2',
    challanNumber: 'DN/2026/002',
    dispatchDate: '2026-02-16',
    client: {
      name: 'Precision Engineering Works',
      address: '88 Tech Ridge Blvd, Austin, TX 78753',
      contactPhone: '+1 (512) 555-0122'
    },
    transporterName: 'UPS Freight Express',
    vehicleNumber: 'UPS-FLT-4455',
    ewayBillNumber: 'BOL-4819203948',
    purpose: 'Supply of Goods',
    totalPackages: 40,
    totalWeightKg: 450,
    items: [
      { id: '1', description: 'Custom Corrugated Shipping Boxes (Bundle of 100)', quantity: 40, unit: 'Boxes', hsnCode: 'BOX-CRGT' }
    ],
    status: 'Delivered',
    convertedInvoiceId: 'INV/2026/0038',
    createdAt: '2026-02-16T09:15:00.000Z'
  }
]

// Seed Records for Credit Notes
export const DEFAULT_CREDIT_NOTES: CreditNote[] = [
  {
    id: 'cn-1',
    creditNoteNumber: 'CN/2026/001',
    originalInvoiceNumber: 'INV/2026/0014',
    client: {
      name: 'Acuity Tech Partners',
      email: 'finance@acuitytech.com'
    },
    issueDate: '2026-02-14',
    reason: 'Defective Goods Return',
    creditAmount: 895,
    taxAdjustment: 89.50,
    totalCredit: 984.50,
    currency: 'USD',
    status: 'Adjusted against Invoice',
    createdAt: '2026-02-14T11:00:00.000Z'
  },
  {
    id: 'cn-2',
    creditNoteNumber: 'CN/2026/002',
    originalInvoiceNumber: 'INV/2026/0022',
    client: {
      name: 'Starlight E-Commerce',
      email: 'billing@starlight.store'
    },
    issueDate: '2026-02-23',
    reason: 'Price Difference / Rebate',
    creditAmount: 520,
    taxAdjustment: 52,
    totalCredit: 572,
    currency: 'USD',
    status: 'Open',
    createdAt: '2026-02-23T15:30:00.000Z'
  }
]

const STORAGE_KEYS = {
  QUOTES: 'inkviz_quotations',
  PROFORMA: 'inkviz_proforma',
  CHALLANS: 'inkviz_challans',
  CREDIT_NOTES: 'inkviz_credit_notes',
  EVENT: 'inkviz_documents_updated'
}

export function useDocuments() {
  const [quotations, setQuotations] = useState<Quotation[]>(DEFAULT_QUOTATIONS)
  const [proforma, setProforma] = useState<ProformaInvoice[]>(DEFAULT_PROFORMA)
  const [challans, setChallans] = useState<DeliveryChallan[]>(DEFAULT_CHALLANS)
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>(DEFAULT_CREDIT_NOTES)
  const [isLoaded, setIsLoaded] = useState(false)

  const reload = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const q = localStorage.getItem(STORAGE_KEYS.QUOTES)
      if (q) setQuotations(JSON.parse(q))
      else localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(DEFAULT_QUOTATIONS))

      const p = localStorage.getItem(STORAGE_KEYS.PROFORMA)
      if (p) setProforma(JSON.parse(p))
      else localStorage.setItem(STORAGE_KEYS.PROFORMA, JSON.stringify(DEFAULT_PROFORMA))

      const c = localStorage.getItem(STORAGE_KEYS.CHALLANS)
      if (c) setChallans(JSON.parse(c))
      else localStorage.setItem(STORAGE_KEYS.CHALLANS, JSON.stringify(DEFAULT_CHALLANS))

      const cn = localStorage.getItem(STORAGE_KEYS.CREDIT_NOTES)
      if (cn) setCreditNotes(JSON.parse(cn))
      else localStorage.setItem(STORAGE_KEYS.CREDIT_NOTES, JSON.stringify(DEFAULT_CREDIT_NOTES))

      setIsLoaded(true)
    } catch (e) {
      console.error('Failed to load documents from localStorage', e)
    }
  }, [])

  useEffect(() => {
    reload()
    const handleUpdate = () => reload()
    window.addEventListener(STORAGE_KEYS.EVENT, handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener(STORAGE_KEYS.EVENT, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [reload])

  const notifyUpdate = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(STORAGE_KEYS.EVENT))
    }
  }

  const syncToInvoicesLedger = (invoice: {
    id: string
    client: string
    clientEmail?: string
    clientAddress?: string
    amount: number
    status: 'published' | 'paid' | 'draft' | 'overdue'
    issueDate: string
    dueDate: string
    items?: any[]
    source?: string
  }) => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem('inkviz_invoices')
      const current = raw ? JSON.parse(raw) : []
      const updated = [invoice, ...current.filter((i: any) => i.id !== invoice.id)]
      localStorage.setItem('inkviz_invoices', JSON.stringify(updated))
      window.dispatchEvent(new Event('inkviz_invoices_updated'))
    } catch (e) {
      console.error('Failed to sync to invoice ledger', e)
    }
  }

  // --- Quotation Methods ---
  const addQuotation = (quote: Omit<Quotation, 'id' | 'createdAt'>) => {
    const newQuote: Quotation = {
      ...quote,
      id: 'quote-' + Date.now().toString(36),
      createdAt: new Date().toISOString()
    }
    const updated = [newQuote, ...quotations]
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(updated))
    setQuotations(updated)
    notifyUpdate()
    return newQuote
  }

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    const updated = quotations.map(q => q.id === id ? { ...q, ...updates } : q)
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(updated))
    setQuotations(updated)
    notifyUpdate()
  }

  const deleteQuotation = (id: string) => {
    const updated = quotations.filter(q => q.id !== id)
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(updated))
    setQuotations(updated)
    notifyUpdate()
  }

  const convertQuotationToInvoice = (quoteId: string) => {
    const quote = quotations.find(q => q.id === quoteId)
    if (!quote) return null
    const generatedInvoiceNumber = 'INV/' + new Date().getFullYear() + '/' + Math.floor(1000 + Math.random() * 9000)
    updateQuotation(quoteId, {
      status: 'Accepted',
      convertedInvoiceId: generatedInvoiceNumber
    })
    const invoiceItems = quote.items.map(it => ({
      id: it.id,
      description: it.description,
      quantity: it.quantity,
      rate: it.rate,
      amount: it.amount,
      hsnCode: it.hsnCode || '',
      unit: it.unit || 'Pcs',
      itemDiscount: 0,
    }))
    syncToInvoicesLedger({
      id: generatedInvoiceNumber,
      client: quote.client.name,
      clientEmail: quote.client.email,
      clientAddress: quote.client.address,
      amount: quote.total,
      status: 'published',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: invoiceItems,
      source: `Quotation: ${quote.quoteNumber}`
    })
    return generatedInvoiceNumber
  }

  // --- Proforma Methods ---
  const addProforma = (item: Omit<ProformaInvoice, 'id' | 'createdAt'>) => {
    const newPI: ProformaInvoice = {
      ...item,
      id: 'pi-' + Date.now().toString(36),
      createdAt: new Date().toISOString()
    }
    const updated = [newPI, ...proforma]
    localStorage.setItem(STORAGE_KEYS.PROFORMA, JSON.stringify(updated))
    setProforma(updated)
    notifyUpdate()
    return newPI
  }

  const updateProforma = (id: string, updates: Partial<ProformaInvoice>) => {
    const updated = proforma.map(p => p.id === id ? { ...p, ...updates } : p)
    localStorage.setItem(STORAGE_KEYS.PROFORMA, JSON.stringify(updated))
    setProforma(updated)
    notifyUpdate()
  }

  const deleteProforma = (id: string) => {
    const updated = proforma.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEYS.PROFORMA, JSON.stringify(updated))
    setProforma(updated)
    notifyUpdate()
  }

  const recordProformaAdvance = (id: string, advanceAmount: number) => {
    const pi = proforma.find(p => p.id === id)
    if (!pi) return
    const newAdvancePaid = advanceAmount
    const newBalance = Math.max(0, pi.total - newAdvancePaid)
    const newStatus: ProformaInvoice['status'] = newAdvancePaid >= pi.advanceRequired && pi.advanceRequired > 0
      ? 'Advance Received'
      : 'Pending Advance'

    updateProforma(id, {
      advancePaid: newAdvancePaid,
      balanceDue: newBalance,
      status: newStatus
    })
  }

  const convertProformaToInvoice = (piId: string) => {
    const pi = proforma.find(p => p.id === piId)
    if (!pi) return null
    const generatedInvoiceNumber = 'INV/' + new Date().getFullYear() + '/' + Math.floor(1000 + Math.random() * 9000)
    updateProforma(piId, {
      status: 'Converted to Invoice',
      convertedInvoiceId: generatedInvoiceNumber
    })
    const invoiceItems = [
      {
        id: '1',
        description: `Order Fulfillment (${pi.proformaNumber})`,
        quantity: 1,
        rate: pi.total,
        amount: pi.total,
        hsnCode: '',
        unit: 'Pcs',
        itemDiscount: 0,
      }
    ]
    syncToInvoicesLedger({
      id: generatedInvoiceNumber,
      client: pi.client.name,
      clientEmail: pi.client.email,
      clientAddress: pi.client.address,
      amount: pi.total,
      status: 'published',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: invoiceItems,
      source: `Proforma: ${pi.proformaNumber}`
    })
    return generatedInvoiceNumber
  }

  // --- Challan Methods ---
  const addChallan = (challan: Omit<DeliveryChallan, 'id' | 'createdAt'>) => {
    const newChallan: DeliveryChallan = {
      ...challan,
      id: 'dc-' + Date.now().toString(36),
      createdAt: new Date().toISOString()
    }
    const updated = [newChallan, ...challans]
    localStorage.setItem(STORAGE_KEYS.CHALLANS, JSON.stringify(updated))
    setChallans(updated)
    notifyUpdate()
    return newChallan
  }

  const updateChallan = (id: string, updates: Partial<DeliveryChallan>) => {
    const updated = challans.map(c => c.id === id ? { ...c, ...updates } : c)
    localStorage.setItem(STORAGE_KEYS.CHALLANS, JSON.stringify(updated))
    setChallans(updated)
    notifyUpdate()
  }

  const deleteChallan = (id: string) => {
    const updated = challans.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEYS.CHALLANS, JSON.stringify(updated))
    setChallans(updated)
    notifyUpdate()
  }

  const convertChallanToInvoice = (challanId: string) => {
    const challan = challans.find(c => c.id === challanId)
    if (!challan) return null
    const generatedInvoiceNumber = 'INV/' + new Date().getFullYear() + '/' + Math.floor(1000 + Math.random() * 9000)
    updateChallan(challanId, {
      status: 'Delivered',
      convertedInvoiceId: generatedInvoiceNumber
    })
    const invoiceItems = challan.items.map(it => ({
      id: it.id,
      description: `${it.description} (Dispatched via ${challan.transporterName})`,
      quantity: it.quantity,
      rate: 50,
      amount: it.quantity * 50,
      hsnCode: it.hsnCode || '',
      unit: it.unit || 'Pcs',
      itemDiscount: 0,
    }))
    const estimatedAmount = invoiceItems.reduce((sum, item) => sum + item.amount, 0)
    syncToInvoicesLedger({
      id: generatedInvoiceNumber,
      client: challan.client.name,
      clientAddress: challan.client.address,
      amount: estimatedAmount,
      status: 'published',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: invoiceItems,
      source: `Challan: ${challan.challanNumber}`
    })
    return generatedInvoiceNumber
  }

  // --- Credit Note Methods ---
  const addCreditNote = (cn: Omit<CreditNote, 'id' | 'createdAt'>) => {
    const newCN: CreditNote = {
      ...cn,
      id: 'cn-' + Date.now().toString(36),
      createdAt: new Date().toISOString()
    }
    const updated = [newCN, ...creditNotes]
    localStorage.setItem(STORAGE_KEYS.CREDIT_NOTES, JSON.stringify(updated))
    setCreditNotes(updated)
    notifyUpdate()
    return newCN
  }

  const updateCreditNote = (id: string, updates: Partial<CreditNote>) => {
    const updated = creditNotes.map(c => c.id === id ? { ...c, ...updates } : c)
    localStorage.setItem(STORAGE_KEYS.CREDIT_NOTES, JSON.stringify(updated))
    setCreditNotes(updated)
    notifyUpdate()
  }

  const deleteCreditNote = (id: string) => {
    const updated = creditNotes.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEYS.CREDIT_NOTES, JSON.stringify(updated))
    setCreditNotes(updated)
    notifyUpdate()
  }

  return {
    isLoaded,
    quotations,
    addQuotation,
    updateQuotation,
    deleteQuotation,
    convertQuotationToInvoice,
    proforma,
    addProforma,
    updateProforma,
    deleteProforma,
    recordProformaAdvance,
    convertProformaToInvoice,
    challans,
    addChallan,
    updateChallan,
    deleteChallan,
    convertChallanToInvoice,
    creditNotes,
    addCreditNote,
    updateCreditNote,
    deleteCreditNote,
    reload
  }
}
