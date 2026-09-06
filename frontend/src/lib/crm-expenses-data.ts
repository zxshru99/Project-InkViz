"use client"

import { useState, useEffect, useCallback } from 'react'

export interface ClientTransaction {
  id: string
  date: string
  type: 'Invoice' | 'Payment' | 'Credit Note'
  reference: string
  amount: number
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Wire Transfer' | 'Cheque' | 'Card'
  balanceAfter: number
  notes?: string
}

export interface ClientRecord {
  id: string
  name: string
  contactPerson?: string
  email: string
  phone: string
  mobile?: string // for WhatsApp
  billingAddress: string
  shippingAddress?: string
  taxId?: string
  gstin?: string
  pan?: string
  currency: string
  totalBilled: number
  totalPaid: number
  balanceDue: number
  status: 'Active' | 'Inactive'
  transactions: ClientTransaction[]
  createdAt: string
}

export interface VendorRecord {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  category: 'Raw Materials' | 'Software & Subscriptions' | 'Office & Utilities' | 'Logistics' | 'Professional Services' | 'Hardware'
  taxId?: string
  gstin?: string
  address: string
  paymentTerms: string
  totalPurchased: number
  balanceOwed: number
  status: 'Active' | 'Inactive'
  createdAt: string
}

export interface ExpenseRecord {
  id: string
  expenseNumber: string
  title: string
  category: 'Software & Subscriptions' | 'Office & Utilities' | 'Travel & Meals' | 'Contractor & Payroll' | 'Marketing & Ads' | 'Logistics & Shipping' | 'Hardware & Equipment'
  vendorName: string
  amount: number
  taxDeductible: boolean
  taxAmount: number
  date: string
  paymentMethod: 'Cash' | 'Bank Wire' | 'Wire Transfer' | 'Credit Card'
  isBillable: boolean
  clientId?: string
  clientName?: string
  receiptName?: string
  notes?: string
  createdAt: string
}

export interface POItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  unit: string
  hsnCode?: string
}

export interface PurchaseOrderRecord {
  id: string
  poNumber: string
  vendorId: string
  vendorName: string
  vendorEmail: string
  vendorAddress?: string
  issueDate: string
  expectedDeliveryDate: string
  items: POItem[]
  subtotal: number
  taxAmount: number
  total: number
  currency: string
  status: 'Draft' | 'Issued' | 'Received' | 'Cancelled'
  notes?: string
  createdAt: string
}

// Seed Clients with Transaction Ledgers
export const DEFAULT_CLIENTS: ClientRecord[] = [
  {
    id: 'client-1',
    name: 'Nexus Global Tech Inc.',
    contactPerson: 'Arthur Vance (VP Finance)',
    email: 'billing@nexusglobaltech.io',
    phone: '+1 (415) 555-0192',
    mobile: '14155550192',
    billingAddress: '500 Howard St, Suite 400, San Francisco, CA 94105',
    shippingAddress: '500 Howard St, Suite 400, San Francisco, CA 94105',
    taxId: 'US-EIN-94-3214567',
    gstin: 'US-EIN-94-3214567',
    currency: 'USD',
    totalBilled: 15340,
    totalPaid: 10000,
    balanceDue: 5340,
    status: 'Active',
    transactions: [
      { id: 'tx-1', date: '2026-02-15', type: 'Invoice', reference: 'INV/2026/0014', amount: 15340, balanceAfter: 15340, notes: 'Cloud infrastructure & web application contract' },
      { id: 'tx-2', date: '2026-02-22', type: 'Payment', reference: 'WIRE/2026/9021', amount: 10000, paymentMethod: 'Wire Transfer', balanceAfter: 5340, notes: 'First milestone advance received' }
    ],
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'client-2',
    name: 'Acme Global Corporation',
    contactPerson: 'Sarah Jenkins',
    email: 'contact@acme.com',
    phone: '+1 (212) 555-0100',
    mobile: '12125550100',
    billingAddress: '123 Business Rd, Suite 400, New York, NY 10001',
    shippingAddress: 'Acme Fulfillment Ctr, 500 River St, Jersey City, NJ 07302',
    taxId: 'US-EIN-13-8829102',
    gstin: 'US-EIN-13-8829102',
    currency: 'USD',
    totalBilled: 12450,
    totalPaid: 12450,
    balanceDue: 0,
    status: 'Active',
    transactions: [
      { id: 'tx-3', date: '2026-01-20', type: 'Invoice', reference: 'INV-0012', amount: 12450, balanceAfter: 12450, notes: 'Enterprise Consulting SLA' },
      { id: 'tx-4', date: '2026-02-05', type: 'Payment', reference: 'WIRE-US-891', amount: 12450, paymentMethod: 'Bank Transfer', balanceAfter: 0, notes: 'SWIFT wire transfer received in full' }
    ],
    createdAt: '2026-01-05T08:30:00.000Z'
  },
  {
    id: 'client-3',
    name: 'Zenith Distribution Logistics LLC',
    contactPerson: 'Robert Miller',
    email: 'ap@zenithdistribution.com',
    phone: '+1 (214) 555-0188',
    mobile: '12145550188',
    billingAddress: '450 Logistics Way, Suite 10, Dallas, TX 75201',
    shippingAddress: '450 Logistics Way, Suite 10, Dallas, TX 75201',
    taxId: 'US-EIN-75-9988123',
    gstin: 'US-EIN-75-9988123',
    currency: 'USD',
    totalBilled: 9500,
    totalPaid: 4750,
    balanceDue: 4750,
    status: 'Active',
    transactions: [
      { id: 'tx-5', date: '2026-02-10', type: 'Invoice', reference: 'INV/2026/0022', amount: 9500, balanceAfter: 9500, notes: 'Retail fixtures & equipment' },
      { id: 'tx-6', date: '2026-02-18', type: 'Payment', reference: 'ACH-CHASE-4412', amount: 4750, paymentMethod: 'Bank Transfer', balanceAfter: 4750, notes: '50% advance payment' }
    ],
    createdAt: '2026-01-15T11:45:00.000Z'
  },
  {
    id: 'client-4',
    name: 'Starlight E-Commerce Ventures Ltd',
    contactPerson: 'Katherine Reynolds',
    email: 'billing@starlight.store',
    phone: '+44 20 7946 0912',
    mobile: '442079460912',
    billingAddress: '10 Finsbury Square, London EC2A 1AF, United Kingdom',
    taxId: 'GB-VAT-9921448',
    gstin: 'GB-VAT-9921448',
    currency: 'USD',
    totalBilled: 7800,
    totalPaid: 2000,
    balanceDue: 5800,
    status: 'Active',
    transactions: [
      { id: 'tx-7', date: '2026-02-01', type: 'Invoice', reference: 'INV/2026/0009', amount: 7800, balanceAfter: 7800, notes: 'Annual catalog photography & digital marketing' },
      { id: 'tx-8', date: '2026-02-14', type: 'Payment', reference: 'CARD/2026/1098', amount: 2000, paymentMethod: 'Card', balanceAfter: 5800, notes: 'Interim payment' }
    ],
    createdAt: '2026-01-18T14:10:00.000Z'
  }
]

// Seed Vendors
export const DEFAULT_VENDORS: VendorRecord[] = [
  {
    id: 'vendor-1',
    name: 'Amazon Web Services Inc.',
    contactPerson: 'Enterprise Cloud Support',
    email: 'aws-billing@amazon.com',
    phone: '+1 800-200-2222',
    category: 'Software & Subscriptions',
    taxId: 'US-EIN-91-1234567',
    gstin: 'US-EIN-91-1234567',
    address: '410 Terry Ave N, Seattle, WA 98109',
    paymentTerms: 'Net 30',
    totalPurchased: 8500,
    balanceOwed: 0,
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'vendor-2',
    name: 'FedEx Freight Direct',
    contactPerson: 'Logistics Fleet Operations',
    email: 'dispatch@fedex.com',
    phone: '+1 800-463-3339',
    category: 'Logistics',
    taxId: 'US-EIN-71-0427007',
    gstin: 'US-EIN-71-0427007',
    address: '1715 Aaron Brenner Dr, Memphis, TN 38120',
    paymentTerms: 'Net 15',
    totalPurchased: 4200,
    balanceOwed: 1200,
    status: 'Active',
    createdAt: '2026-01-10T09:00:00.000Z'
  },
  {
    id: 'vendor-3',
    name: 'Steelcase Commercial Solutions',
    contactPerson: 'Corporate Sales Team',
    email: 'b2b@steelcase.com',
    phone: '+1 800-333-9939',
    category: 'Hardware',
    taxId: 'US-EIN-38-0819050',
    gstin: 'US-EIN-38-0819050',
    address: '901 44th St SE, Grand Rapids, MI 49508',
    paymentTerms: 'Net 30',
    totalPurchased: 17400,
    balanceOwed: 3400,
    status: 'Active',
    createdAt: '2026-01-15T10:30:00.000Z'
  },
  {
    id: 'vendor-4',
    name: 'Verizon Business Enterprise',
    contactPerson: 'Enterprise Accounts',
    email: 'telecom@verizon.com',
    phone: '+1 800-922-0204',
    category: 'Office & Utilities',
    taxId: 'US-EIN-13-2641010',
    gstin: 'US-EIN-13-2641010',
    address: '1095 Avenue of the Americas, New York, NY 10036',
    paymentTerms: 'Net 15',
    totalPurchased: 1850,
    balanceOwed: 0,
    status: 'Active',
    createdAt: '2026-01-20T12:00:00.000Z'
  }
]

// Seed Expenses
export const DEFAULT_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    expenseNumber: 'EXP/2026/001',
    title: 'AWS Production Kubernetes Cluster & Aurora DB',
    category: 'Software & Subscriptions',
    vendorName: 'Amazon Web Services Inc.',
    amount: 2450,
    taxDeductible: true,
    taxAmount: 245.00,
    date: '2026-02-10',
    paymentMethod: 'Credit Card',
    isBillable: true,
    clientId: 'client-1',
    clientName: 'Nexus Global Tech Inc.',
    receiptName: 'aws-invoice-feb2026.pdf',
    notes: 'Primary production cloud infrastructure. Reimbursable as cloud hosting SLA.',
    createdAt: '2026-02-10T15:00:00.000Z'
  },
  {
    id: 'exp-2',
    expenseNumber: 'EXP/2026/002',
    title: 'Dedicated High-Speed Fiber Internet Leased Line',
    category: 'Office & Utilities',
    vendorName: 'Verizon Business Enterprise',
    amount: 850,
    taxDeductible: true,
    taxAmount: 85.00,
    date: '2026-02-15',
    paymentMethod: 'Bank Wire',
    isBillable: false,
    receiptName: 'verizon-leasedline-feb.pdf',
    notes: 'Monthly 500 Mbps symmetrical fiber connection.',
    createdAt: '2026-02-15T11:20:00.000Z'
  },
  {
    id: 'exp-3',
    expenseNumber: 'EXP/2026/003',
    title: 'Inter-State Material Transportation & Delivery',
    category: 'Logistics & Shipping',
    vendorName: 'FedEx Freight Direct',
    amount: 1420,
    taxDeductible: true,
    taxAmount: 142.00,
    date: '2026-02-21',
    paymentMethod: 'Credit Card',
    isBillable: true,
    clientId: 'client-3',
    clientName: 'Zenith Distribution Logistics LLC',
    receiptName: 'fedex-consignment-dc01.pdf',
    notes: 'Bill of lading shipment to Dallas logistics hub.',
    createdAt: '2026-02-21T09:30:00.000Z'
  },
  {
    id: 'exp-4',
    expenseNumber: 'EXP/2026/004',
    title: 'Google Workspace Enterprise Starter Licenses',
    category: 'Software & Subscriptions',
    vendorName: 'Google LLC',
    amount: 620,
    taxDeductible: true,
    taxAmount: 62.00,
    date: '2026-02-25',
    paymentMethod: 'Credit Card',
    isBillable: false,
    receiptName: 'google-workspace-receipt.pdf',
    notes: 'Company email addresses & Google Drive storage.',
    createdAt: '2026-02-25T14:15:00.000Z'
  }
]

// Seed Purchase Orders
export const DEFAULT_PURCHASE_ORDERS: PurchaseOrderRecord[] = [
  {
    id: 'po-1',
    poNumber: 'PO/2026/001',
    vendorId: 'vendor-3',
    vendorName: 'Steelcase Commercial Solutions',
    vendorEmail: 'b2b@steelcase.com',
    vendorAddress: '901 44th St SE, Grand Rapids, MI 49508',
    issueDate: '2026-02-18',
    expectedDeliveryDate: '2026-03-08',
    items: [
      { id: '1', description: 'Ergonomic Executive Mesh Chair', quantity: 10, rate: 1200, amount: 12000, unit: 'Pcs', hsnCode: 'CHAIR-EXEC' },
      { id: '2', description: 'Motorized Height-Adjustable Standing Desk', quantity: 2, rate: 2700, amount: 5400, unit: 'Pcs', hsnCode: 'DESK-STAND' }
    ],
    subtotal: 17400,
    taxAmount: 1740,
    total: 19140,
    currency: 'USD',
    status: 'Issued',
    notes: 'Procurement order for client office upgrade. Standard 1-year warranty included.',
    createdAt: '2026-02-18T10:00:00.000Z'
  },
  {
    id: 'po-2',
    poNumber: 'PO/2026/002',
    vendorId: 'vendor-2',
    vendorName: 'FedEx Freight Direct',
    vendorEmail: 'dispatch@fedex.com',
    vendorAddress: '1715 Aaron Brenner Dr, Memphis, TN 38120',
    issueDate: '2026-02-12',
    expectedDeliveryDate: '2026-02-20',
    items: [
      { id: '1', description: 'Heavy Machinery Freight Transport (32ft Multi-Axle)', quantity: 1, rate: 3500, amount: 3500, unit: 'Flat', hsnCode: 'FRT-HEAVY' }
    ],
    subtotal: 3500,
    taxAmount: 350,
    total: 3850,
    currency: 'USD',
    status: 'Received',
    notes: 'Shipment delivered to factory facility on Feb 20.',
    createdAt: '2026-02-12T09:30:00.000Z'
  }
]

const STORAGE_KEYS = {
  CLIENTS: 'inkviz_clients',
  VENDORS: 'inkviz_vendors',
  EXPENSES: 'inkviz_expenses',
  POS: 'inkviz_purchase_orders',
  EVENT: 'inkviz_crm_updated'
}

export function useCrmExpenses() {
  const [clients, setClients] = useState<ClientRecord[]>(DEFAULT_CLIENTS)
  const [vendors, setVendors] = useState<VendorRecord[]>(DEFAULT_VENDORS)
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(DEFAULT_EXPENSES)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(DEFAULT_PURCHASE_ORDERS)
  const [isLoaded, setIsLoaded] = useState(false)

  const reload = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const c = localStorage.getItem(STORAGE_KEYS.CLIENTS)
      if (c) setClients(JSON.parse(c))
      else localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(DEFAULT_CLIENTS))

      const v = localStorage.getItem(STORAGE_KEYS.VENDORS)
      if (v) setVendors(JSON.parse(v))
      else localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(DEFAULT_VENDORS))

      const e = localStorage.getItem(STORAGE_KEYS.EXPENSES)
      if (e) setExpenses(JSON.parse(e))
      else localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES))

      const po = localStorage.getItem(STORAGE_KEYS.POS)
      if (po) setPurchaseOrders(JSON.parse(po))
      else localStorage.setItem(STORAGE_KEYS.POS, JSON.stringify(DEFAULT_PURCHASE_ORDERS))

      setIsLoaded(true)
    } catch (err) {
      console.error('Failed to load CRM & Expenses from localStorage', err)
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

  // --- CLIENT METHODS ---
  const addClient = (client: Omit<ClientRecord, 'id' | 'createdAt' | 'transactions' | 'totalBilled' | 'totalPaid' | 'balanceDue'>) => {
    const newClient: ClientRecord = {
      ...client,
      id: 'client-' + Date.now().toString(36),
      totalBilled: 0,
      totalPaid: 0,
      balanceDue: 0,
      transactions: [],
      createdAt: new Date().toISOString()
    }
    const updated = [newClient, ...clients]
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated))
    setClients(updated)
    notifyUpdate()
    return newClient
  }

  const updateClient = (id: string, updates: Partial<ClientRecord>) => {
    const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c)
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated))
    setClients(updated)
    notifyUpdate()
  }

  const deleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated))
    setClients(updated)
    notifyUpdate()
  }

  const recordClientPayment = (
    clientId: string, 
    payment: {
      amount: number
      date: string
      paymentMethod: 'Cash' | 'Bank Transfer' | 'Wire Transfer' | 'Cheque' | 'Card'
      reference: string
      notes?: string
    }
  ) => {
    const client = clients.find(c => c.id === clientId)
    if (!client) return

    const newTotalPaid = client.totalPaid + payment.amount
    const newBalance = Math.max(0, client.totalBilled - newTotalPaid)
    
    const newTx: ClientTransaction = {
      id: 'tx-' + Date.now().toString(36),
      date: payment.date,
      type: 'Payment',
      reference: payment.reference,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      balanceAfter: newBalance,
      notes: payment.notes
    }

    const updated = clients.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          totalPaid: newTotalPaid,
          balanceDue: newBalance,
          transactions: [newTx, ...c.transactions]
        }
      }
      return c
    })

    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated))
    setClients(updated)
    notifyUpdate()
    return newTx
  }

  // --- VENDOR METHODS ---
  const addVendor = (vendor: Omit<VendorRecord, 'id' | 'createdAt' | 'totalPurchased' | 'balanceOwed'>) => {
    const newVendor: VendorRecord = {
      ...vendor,
      id: 'vendor-' + Date.now().toString(36),
      totalPurchased: 0,
      balanceOwed: 0,
      createdAt: new Date().toISOString()
    }
    const updated = [newVendor, ...vendors]
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(updated))
    setVendors(updated)
    notifyUpdate()
    return newVendor
  }

  const updateVendor = (id: string, updates: Partial<VendorRecord>) => {
    const updated = vendors.map(v => v.id === id ? { ...v, ...updates } : v)
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(updated))
    setVendors(updated)
    notifyUpdate()
  }

  const deleteVendor = (id: string) => {
    const updated = vendors.filter(v => v.id !== id)
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(updated))
    setVendors(updated)
    notifyUpdate()
  }

  // --- EXPENSE METHODS ---
  const addExpense = (expense: Omit<ExpenseRecord, 'id' | 'createdAt'>) => {
    const newExpense: ExpenseRecord = {
      ...expense,
      id: 'exp-' + Date.now().toString(36),
      createdAt: new Date().toISOString()
    }
    const updated = [newExpense, ...expenses]
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated))
    setExpenses(updated)
    notifyUpdate()
    return newExpense
  }

  const updateExpense = (id: string, updates: Partial<ExpenseRecord>) => {
    const updated = expenses.map(e => e.id === id ? { ...e, ...updates } : e)
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated))
    setExpenses(updated)
    notifyUpdate()
  }

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id)
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated))
    setExpenses(updated)
    notifyUpdate()
  }

  // --- PURCHASE ORDER METHODS ---
  const addPurchaseOrder = (po: Omit<PurchaseOrderRecord, 'id' | 'createdAt'>) => {
    const newPO: PurchaseOrderRecord = {
      ...po,
      id: 'po-' + Date.now().toString(36),
      createdAt: new Date().toISOString()
    }
    const updated = [newPO, ...purchaseOrders]
    localStorage.setItem(STORAGE_KEYS.POS, JSON.stringify(updated))
    setPurchaseOrders(updated)
    notifyUpdate()
    return newPO
  }

  const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrderRecord>) => {
    const updated = purchaseOrders.map(p => p.id === id ? { ...p, ...updates } : p)
    localStorage.setItem(STORAGE_KEYS.POS, JSON.stringify(updated))
    setPurchaseOrders(updated)
    notifyUpdate()
  }

  const deletePurchaseOrder = (id: string) => {
    const updated = purchaseOrders.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEYS.POS, JSON.stringify(updated))
    setPurchaseOrders(updated)
    notifyUpdate()
  }

  return {
    isLoaded,
    clients,
    addClient,
    updateClient,
    deleteClient,
    recordClientPayment,
    vendors,
    addVendor,
    updateVendor,
    deleteVendor,
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    reload
  }
}
