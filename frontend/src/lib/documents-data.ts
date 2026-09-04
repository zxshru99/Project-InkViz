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
      name: 'Nexus FinTech Solutions Pvt Ltd',
      email: 'billing@nexusfintech.io',
      phone: '+91 98765 43210',
      address: 'Plot 42, Cyber Gateway, Hitech City, Hyderabad, 500081'
    },
    issueDate: '2026-02-15',
    expiryDate: '2026-03-15',
    items: [
      { id: '1', description: 'Cloud Infrastructure & DevOps Setup', quantity: 1, rate: 45000, amount: 45000, hsnCode: '998313', unit: 'Hrs' },
      { id: '2', description: 'Full-Stack Web Application Development', quantity: 1, rate: 85000, amount: 85000, hsnCode: '998314', unit: 'Flat' }
    ],
    subtotal: 130000,
    taxRate: 18,
    taxAmount: 23400,
    total: 153400,
    currency: 'INR',
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
      phone: '+91 91234 56789',
      address: '14 Commerce Hub, Andheri East, Mumbai, 400069'
    },
    issueDate: '2026-02-20',
    expiryDate: '2026-03-05',
    items: [
      { id: '1', description: 'Ergonomic Executive Office Chair', quantity: 12, rate: 14500, amount: 174000, hsnCode: '940130', unit: 'Pcs' }
    ],
    subtotal: 174000,
    taxRate: 18,
    taxAmount: 31320,
    total: 205320,
    currency: 'INR',
    status: 'Accepted',
    convertedInvoiceId: 'INV/2026/0042',
    notes: 'Bulk discount of 5% already applied.',
    createdAt: '2026-02-20T11:30:00.000Z'
  },
  {
    id: 'quote-3',
    quoteNumber: 'EST/2026/003',
    client: {
      name: 'Apex HyperScale Analytics',
      email: 'accounts@apexhs.com',
      phone: '+91 98888 12345',
      address: 'Tower B, Outer Ring Rd, Bellandur, Bengaluru, 560103'
    },
    issueDate: '2026-01-10',
    expiryDate: '2026-01-25',
    items: [
      { id: '1', description: 'UI/UX Design System & Mobile App Mockups', quantity: 1, rate: 32000, amount: 32000, hsnCode: '998311', unit: 'Days' }
    ],
    subtotal: 32000,
    taxRate: 18,
    taxAmount: 5760,
    total: 37760,
    currency: 'INR',
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
    total: 280000,
    advanceRequired: 140000,
    advancePaid: 140000,
    balanceDue: 140000,
    currency: 'INR',
    status: 'Advance Received',
    notes: '50% advance received via SWIFT wire transfer. Production initiated.',
    createdAt: '2026-02-18T10:00:00.000Z'
  },
  {
    id: 'pi-2',
    proformaNumber: 'PI/2026/002',
    poNumber: 'PO-ZTH-4410',
    client: {
      name: 'Zenith Retail Chain',
      email: 'ap@zenithretail.in',
      address: 'Sector 62, Noida, Uttar Pradesh, 201309'
    },
    issueDate: '2026-02-24',
    dueDate: '2026-03-10',
    total: 95000,
    advanceRequired: 47500,
    advancePaid: 0,
    balanceDue: 95000,
    currency: 'INR',
    status: 'Pending Advance',
    notes: 'Advance payment of 50% required before batch dispatch.',
    createdAt: '2026-02-24T12:00:00.000Z'
  }
]

// Seed Records for Delivery Challans
export const DEFAULT_CHALLANS: DeliveryChallan[] = [
  {
    id: 'dc-1',
    challanNumber: 'DC/2026/001',
    dispatchDate: '2026-02-22',
    client: {
      name: 'Zenith Retail Distribution Hub',
      address: 'Warehouse #4, Bhiwandi Logistics Park, Thane, 421302',
      contactPhone: '+91 99000 88776'
    },
    transporterName: 'BlueDart Express Logistics',
    vehicleNumber: 'MH-04-AZ-8921',
    ewayBillNumber: '341098274619',
    purpose: 'Supply of Goods',
    totalPackages: 15,
    totalWeightKg: 180,
    items: [
      { id: '1', description: 'Ergonomic Executive Office Chair', quantity: 10, unit: 'Pcs', hsnCode: '940130' },
      { id: '2', description: 'Samsung 990 PRO 2TB NVMe PCIe 4.0 SSD', quantity: 5, unit: 'Pcs', hsnCode: '847170' }
    ],
    status: 'In Transit',
    createdAt: '2026-02-22T08:30:00.000Z'
  },
  {
    id: 'dc-2',
    challanNumber: 'DC/2026/002',
    dispatchDate: '2026-02-16',
    client: {
      name: 'Precision Engineering Job Works',
      address: 'MIDC Industrial Estate, Pune, 411018',
      contactPhone: '+91 98220 11223'
    },
    transporterName: 'SafeX Logistics Fleet',
    vehicleNumber: 'MH-12-PQ-4455',
    ewayBillNumber: '481920394851',
    purpose: 'Job Work',
    totalPackages: 40,
    totalWeightKg: 450,
    items: [
      { id: '1', description: 'Custom Corrugated Shipping Boxes (Bundle of 100)', quantity: 40, unit: 'Boxes', hsnCode: '481910' }
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
    creditAmount: 8995,
    taxAdjustment: 1619.10,
    totalCredit: 10614.10,
    currency: 'INR',
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
    creditAmount: 5200,
    taxAdjustment: 624,
    totalCredit: 5824,
    currency: 'INR',
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
      hsnCode: it.hsnCode || '9983',
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
        hsnCode: '9983',
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
      rate: 500,
      amount: it.quantity * 500,
      hsnCode: it.hsnCode || '481910',
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
