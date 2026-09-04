"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  hsnCode: string;
  unit: 'Pcs' | 'Hrs' | 'Days' | 'Kg' | 'Grams' | 'Boxes' | 'Liters' | 'Meters' | 'Flat';
  itemDiscount: number;
}

export type InvoiceData = {
  invoiceNumber: string;
  poNumber: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: string;
  client: {
    name: string;
    email: string;
    address: string;
  };
  billFrom: {
    name: string;
    email: string;
    address: string;
  };
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  shippingFee: number;
  packagingFee: number;
  handlingFee: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  notes: string;
  paymentDetails: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  swiftCode: string;
  branch: string;
  upiId: string;
  showQRCode: boolean;
  showStamp: boolean;
  showBankDetails: boolean;
  showSignature: boolean;
  showWatermark: boolean;
  watermarkStatus: 'PAID' | 'DRAFT' | 'OVERDUE' | 'CANCELLED' | 'SAMPLE' | null;
  signatureFont: 'dancing' | 'greatvibes' | 'sacramento' | 'pacifico';
  signatureData: string;
  signatureTitle: string;
  documentType: 'invoice' | 'quotation' | 'proforma' | 'challan';
  quoteExpiry: string;
  template: 'classic' | 'modern' | 'minimal' | 'apex' | 'lumina' | 'nexus' | 'heritage' | 'prism' | 'velocity';
  themeColor: string;
  font: string;
}

const defaultInvoiceData: InvoiceData = {
  invoiceNumber: 'INV-0001',
  poNumber: '',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
  paymentTerms: 'Net 30',
  currency: 'USD',
  client: { name: '', email: '', address: '' },
  billFrom: { name: 'My Company', email: 'hello@mycompany.com', address: '123 Business Rd\nCity, State 12345' },
  items: [
    { id: '1', description: 'Web Design Services', quantity: 1, rate: 1000, amount: 1000, hsnCode: '9983', unit: 'Hrs', itemDiscount: 0 }
  ],
  subtotal: 1000,
  taxRate: 0,
  taxAmount: 0,
  cgstRate: 0,
  sgstRate: 0,
  igstRate: 0,
  discountType: 'percentage',
  discountValue: 0,
  discountAmount: 0,
  shippingFee: 0,
  packagingFee: 0,
  handlingFee: 0,
  total: 1000,
  amountPaid: 0,
  balanceDue: 1000,
  notes: 'Thank you for your business!',
  paymentDetails: 'Please make payment via bank transfer to:\nBank: Example Bank\nAccount: 1234567890\nSort Code: 12-34-56',
  bankName: '',
  accountHolderName: '',
  accountNumber: '',
  ifscCode: '',
  swiftCode: '',
  branch: '',
  upiId: '',
  showQRCode: false,
  showStamp: false,
  showBankDetails: false,
  showSignature: false,
  showWatermark: false,
  watermarkStatus: null,
  signatureFont: 'dancing',
  signatureData: '',
  signatureTitle: 'Authorized Signatory',
  documentType: 'invoice',
  quoteExpiry: '',
  template: 'classic',
  themeColor: '#000000',
  font: 'inter',
};

type InvoiceContextType = {
  data: InvoiceData;
  updateData: (updates: Partial<InvoiceData>) => void;
  updateItem: (id: string, updates: Partial<LineItem>) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const calculateTotals = (data: InvoiceData): Partial<InvoiceData> => {
  const subtotal = data.items.reduce((sum, item) => sum + (item.amount - (Number(item.itemDiscount) || 0)), 0);
  
  let discountAmount = 0;
  if (data.discountType === 'percentage') {
    discountAmount = subtotal * (Number(data.discountValue) / 100);
  } else {
    discountAmount = Number(data.discountValue) || 0;
  }

  const postDiscount = subtotal - discountAmount;
  const totalTaxRate = Number(data.taxRate || 0) + Number(data.cgstRate || 0) + Number(data.sgstRate || 0) + Number(data.igstRate || 0);
  const taxAmount = postDiscount * (totalTaxRate / 100);
  
  const total = postDiscount + taxAmount + Number(data.shippingFee || 0) + Number(data.packagingFee || 0) + Number(data.handlingFee || 0);
  const balanceDue = total - Number(data.amountPaid || 0);

  return { subtotal, discountAmount, taxAmount, total, balanceDue };
};

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<InvoiceData>(defaultInvoiceData);

  // Load saved settings from Sprint 3 Settings (Bank, UPI, defaults, etc.) on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("inkviz_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(prev => {
          const updates: Partial<InvoiceData> = {};
          if (parsed.bankName) updates.bankName = parsed.bankName;
          if (parsed.accountName) updates.accountHolderName = parsed.accountName;
          if (parsed.accountNumber) updates.accountNumber = parsed.accountNumber;
          if (parsed.ifsc) updates.ifscCode = parsed.ifsc;
          if (parsed.swift) updates.swiftCode = parsed.swift;
          if (parsed.branch) updates.branch = parsed.branch;
          if (parsed.upiId) {
            updates.upiId = parsed.upiId;
            updates.showQRCode = true;
          }
          if (parsed.paymentTerms) updates.paymentTerms = parsed.paymentTerms;
          if (parsed.defaultNotes) updates.notes = parsed.defaultNotes;
          if (parsed.defaultPaymentInstructions) updates.paymentDetails = parsed.defaultPaymentInstructions;
          if (parsed.invoicePrefix && parsed.startingNumber) {
            updates.invoiceNumber = `${parsed.invoicePrefix}${parsed.startingNumber}`;
          }
          if (parsed.billingAddress) {
            updates.billFrom = { ...prev.billFrom, address: parsed.billingAddress };
          }
          if (updates.bankName || updates.accountNumber) {
            updates.showBankDetails = true;
          }

          const newData = { ...prev, ...updates };
          const totals = calculateTotals(newData);
          return { ...newData, ...totals };
        });
      }
    } catch (e) {
      console.error("Failed to load inkviz_settings", e);
    }
  }, []);

  // Auto-calculate totals whenever related fields change
  const updateData = (updates: Partial<InvoiceData>) => {
    setData(prev => {
      const newData = { ...prev, ...updates };
      const totals = calculateTotals(newData);
      return { ...newData, ...totals };
    });
  };

  const updateItem = (id: string, updates: Partial<LineItem>) => {
    setData(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          return updatedItem;
        }
        return item;
      });
      
      const newData = { ...prev, items: newItems };
      const totals = calculateTotals(newData);
      return { ...newData, ...totals };
    });
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      hsnCode: '',
      unit: 'Pcs',
      itemDiscount: 0
    };
    setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setData(prev => {
      const newItems = prev.items.filter(item => item.id !== id);
      const newData = { ...prev, items: newItems };
      const totals = calculateTotals(newData);
      return { ...newData, ...totals };
    });
  };

  return (
    <InvoiceContext.Provider value={{ data, updateData, updateItem, addItem, removeItem }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
}
