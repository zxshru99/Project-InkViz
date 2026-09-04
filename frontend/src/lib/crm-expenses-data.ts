"use client"

import { useState, useEffect, useCallback } from 'react'

export interface ClientTransaction {
  id: string
  date: string
  type: 'Invoice' | 'Payment' | 'Credit Note'
  reference: string
  amount: number
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Card'
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
  paymentMethod: 'Cash' | 'Bank Wire' | 'UPI' | 'Credit Card'
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
    name: 'Nexus FinTech Solutions Pvt Ltd',
    contactPerson: 'Arun Varma (Head of Finance)',
    email: 'billing@nexusfintech.io',
    phone: '+91 98765 43210',
    mobile: '919876543210',
    billingAddress: 'Plot 42, Cyber Gateway, Hitech City, Hyderabad, Telangana 500081',
    shippingAddress: 'Plot 42, Cyber Gateway, Hitech City, Hyderabad, Telangana 500081',
    gstin: '36AABCN1234F1Z8',
    pan: 'AABCN1234F',
    currency: 'INR',
    totalBilled: 153400,
    totalPaid: 100000,
    balanceDue: 53400,
    status: 'Active',
    transactions: [
      { id: 'tx-1', date: '2026-02-15', type: 'Invoice', reference: 'INV/2026/0014', amount: 153400, balanceAfter: 153400, notes: 'Cloud infrastructure & web application contract' },
      { id: 'tx-2', date: '2026-02-22', type: 'Payment', reference: 'UPI/2026/9021', amount: 100000, paymentMethod: 'UPI', balanceAfter: 53400, notes: 'First milestone advance received' }
    ],
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'client-2',
    name: 'Acme Global Corporation',
    contactPerson: 'Sarah Jenkins',
    email: 'contact@acme.com',
    phone: '+1 555-0100',
    mobile: '15550100',
    billingAddress: '123 Business Rd, Suite 400, New York, NY 10001',
    shippingAddress: 'Acme Fulfillment Ctr, 500 River St, Jersey City, NJ 07302',
    gstin: 'US-EIN-94-3214567',
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
    name: 'Zenith Retail Distribution Hub',
    contactPerson: 'Rajesh Nair',
    email: 'ap@zenithretail.in',
    phone: '+91 99000 88776',
    mobile: '919900088776',
    billingAddress: 'Warehouse #4, Bhiwandi Logistics Park, Thane, Maharashtra 421302',
    shippingAddress: 'Warehouse #4, Bhiwandi Logistics Park, Thane, Maharashtra 421302',
    gstin: '27AAACZ4321D1ZO',
    pan: 'AAACZ4321D',
    currency: 'INR',
    totalBilled: 95000,
    totalPaid: 47500,
    balanceDue: 47500,
    status: 'Active',
    transactions: [
      { id: 'tx-5', date: '2026-02-10', type: 'Invoice', reference: 'INV/2026/0022', amount: 95000, balanceAfter: 95000, notes: 'Retail fixtures & equipment' },
      { id: 'tx-6', date: '2026-02-18', type: 'Payment', reference: 'NEFT-AXIS-4412', amount: 47500, paymentMethod: 'Bank Transfer', balanceAfter: 47500, notes: '50% advance payment' }
    ],
    createdAt: '2026-01-15T11:45:00.000Z'
  },
  {
    id: 'client-4',
    name: 'Starlight E-Commerce Ventures',
    contactPerson: 'Kavita Rao',
    email: 'billing@starlight.store',
    phone: '+91 98220 54321',
    mobile: '919822054321',
    billingAddress: 'B-Wing, Prestige Commercial Plaza, Koramangala, Bengaluru, Karnataka 560034',
    gstin: '29AABCS8899K1ZR',
    pan: 'AABCS8899K',
    currency: 'INR',
    totalBilled: 78000,
    totalPaid: 20000,
    balanceDue: 58000,
    status: 'Active',
    transactions: [
      { id: 'tx-7', date: '2026-02-01', type: 'Invoice', reference: 'INV/2026/0009', amount: 78000, balanceAfter: 78000, notes: 'Annual catalog photography & digital marketing' },
      { id: 'tx-8', date: '2026-02-14', type: 'Payment', reference: 'UPI/2026/1098', amount: 20000, paymentMethod: 'UPI', balanceAfter: 58000, notes: 'Interim payment' }
    ],
    createdAt: '2026-01-18T14:10:00.000Z'
  }
]

// Seed Vendors
export const DEFAULT_VENDORS: VendorRecord[] = [
  {
    id: 'vendor-1',
    name: 'Amazon Web Services India Pvt Ltd',
    contactPerson: 'Enterprise Cloud Support',
    email: 'aws-in-billing@amazon.com',
    phone: '+91 80 4000 1100',
    category: 'Software & Subscriptions',
    gstin: '29AAACA6180Q1ZV',
    address: 'World Trade Centre, Brigade Gateway, Bengaluru, Karnataka 560055',
    paymentTerms: 'Net 30',
    totalPurchased: 85000,
    balanceOwed: 0,
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'vendor-2',
    name: 'SafeX Logistics Fleet & Surface Cargo',
    contactPerson: 'Manish Pandey',
    email: 'dispatch@safexlogistics.com',
    phone: '+91 98220 11223',
    category: 'Logistics',
    gstin: '27AAACS9988P1ZM',
    address: 'Plot 18, MIDC Industrial Area, Pune, Maharashtra 411018',
    paymentTerms: 'Net 15',
    totalPurchased: 42000,
    balanceOwed: 12000,
    status: 'Active',
    createdAt: '2026-01-10T09:00:00.000Z'
  },
  {
    id: 'vendor-3',
    name: 'Godrej Interio Manufacturing Division',
    contactPerson: 'Vikram Joshi',
    email: 'b2b@godrejinterio.com',
    phone: '+91 22 6796 1234',
    category: 'Hardware',
    gstin: '27AAACG0582B1Z8',
    address: 'Pirojshanagar, Vikhroli, Mumbai, Maharashtra 400079',
    paymentTerms: 'Net 30',
    totalPurchased: 174000,
    balanceOwed: 34000,
    status: 'Active',
    createdAt: '2026-01-15T10:30:00.000Z'
  },
  {
    id: 'vendor-4',
    name: 'Airtel Enterprise Business Solutions',
    contactPerson: 'Corporate Accounts Team',
    email: 'telecom@airtel.in',
    phone: '+91 1800 102 9000',
    category: 'Office & Utilities',
    gstin: '07AAACA1234P1Z5',
    address: 'Bharti Crescent, 1 Nelson Mandela Marg, Vasant Kunj, New Delhi 110070',
    paymentTerms: 'Net 15',
    totalPurchased: 18500,
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
    vendorName: 'Amazon Web Services India Pvt Ltd',
    amount: 24500,
    taxDeductible: true,
    taxAmount: 3737.28,
    date: '2026-02-10',
    paymentMethod: 'Credit Card',
    isBillable: true,
    clientId: 'client-1',
    clientName: 'Nexus FinTech Solutions Pvt Ltd',
    receiptName: 'aws-invoice-feb2026.pdf',
    notes: 'Primary production cloud infrastructure. Reimbursable as cloud hosting SLA.',
    createdAt: '2026-02-10T15:00:00.000Z'
  },
  {
    id: 'exp-2',
    expenseNumber: 'EXP/2026/002',
    title: 'Office Dedicated High-Speed Leased Line',
    category: 'Office & Utilities',
    vendorName: 'Airtel Enterprise Business Solutions',
    amount: 8500,
    taxDeductible: true,
    taxAmount: 1296.61,
    date: '2026-02-15',
    paymentMethod: 'Bank Wire',
    isBillable: false,
    receiptName: 'airtel-leasedline-feb.pdf',
    notes: 'Monthly 500 Mbps symmetrical fiber internet connection.',
    createdAt: '2026-02-15T11:20:00.000Z'
  },
  {
    id: 'exp-3',
    expenseNumber: 'EXP/2026/003',
    title: 'Inter-State Material Transportation & Delivery',
    category: 'Logistics & Shipping',
    vendorName: 'SafeX Logistics Fleet & Surface Cargo',
    amount: 14200,
    taxDeductible: true,
    taxAmount: 2166.10,
    date: '2026-02-21',
    paymentMethod: 'UPI',
    isBillable: true,
    clientId: 'client-3',
    clientName: 'Zenith Retail Distribution Hub',
    receiptName: 'safex-consignment-dc01.pdf',
    notes: 'E-Way bill shipment to Bhiwandi logistics hub.',
    createdAt: '2026-02-21T09:30:00.000Z'
  },
  {
    id: 'exp-4',
    expenseNumber: 'EXP/2026/004',
    title: 'Google Workspace Enterprise Starter Licenses',
    category: 'Software & Subscriptions',
    vendorName: 'Google Cloud India',
    amount: 6200,
    taxDeductible: true,
    taxAmount: 945.76,
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
    vendorName: 'Godrej Interio Manufacturing Division',
    vendorEmail: 'b2b@godrejinterio.com',
    vendorAddress: 'Pirojshanagar, Vikhroli, Mumbai, Maharashtra 400079',
    issueDate: '2026-02-18',
    expectedDeliveryDate: '2026-03-08',
    items: [
      { id: '1', description: 'Ergonomic Executive Mesh Chair', quantity: 10, rate: 12000, amount: 120000, unit: 'Pcs', hsnCode: '940130' },
      { id: '2', description: 'Motorized Height-Adjustable Standing Desk', quantity: 2, rate: 27000, amount: 54000, unit: 'Pcs', hsnCode: '940310' }
    ],
    subtotal: 174000,
    taxAmount: 31320,
    total: 205320,
    currency: 'INR',
    status: 'Issued',
    notes: 'Procurement order for client office upgrade. Standard 1-year warranty included.',
    createdAt: '2026-02-18T10:00:00.000Z'
  },
  {
    id: 'po-2',
    poNumber: 'PO/2026/002',
    vendorId: 'vendor-2',
    vendorName: 'SafeX Logistics Fleet & Surface Cargo',
    vendorEmail: 'dispatch@safexlogistics.com',
    vendorAddress: 'Plot 18, MIDC Industrial Area, Pune, Maharashtra 411018',
    issueDate: '2026-02-12',
    expectedDeliveryDate: '2026-02-20',
    items: [
      { id: '1', description: 'Heavy Machinery Freight Transport (32ft Multi-Axle)', quantity: 1, rate: 35000, amount: 35000, unit: 'Flat', hsnCode: '996511' }
    ],
    subtotal: 35000,
    taxAmount: 6300,
    total: 41300,
    currency: 'INR',
    status: 'Received',
    notes: 'Shipment delivered to Pune factory facility on Feb 20.',
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
      paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Card'
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
