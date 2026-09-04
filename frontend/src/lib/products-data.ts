"use client"

import { useState, useEffect, useCallback } from 'react'

export type ProductUnit = 'Pcs' | 'Hrs' | 'Days' | 'Kg' | 'Grams' | 'Boxes' | 'Liters' | 'Meters' | 'Flat'
export type ProductType = 'Goods' | 'Service'

export interface Product {
  id: string
  name: string
  description: string
  type: ProductType
  sku: string
  hsnSac: string
  sellingPrice: number
  purchaseCost: number
  unit: ProductUnit
  taxRate: number // 0, 5, 12, 18, 28
  stock: number
  lowStockThreshold: number
  createdAt: string
  updatedAt: string
}

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Cloud Infrastructure & DevOps Setup',
    description: 'Kubernetes cluster deployment, CI/CD pipelines, and cloud security provisioning',
    type: 'Service',
    sku: 'SRV-CLOUD-01',
    hsnSac: '998313',
    sellingPrice: 45000,
    purchaseCost: 15000,
    unit: 'Hrs',
    taxRate: 18,
    stock: 999,
    lowStockThreshold: 10,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'prod-2',
    name: 'Full-Stack Web Application Development',
    description: 'Next.js, Node.js, and MongoDB enterprise SaaS engineering sprint',
    type: 'Service',
    sku: 'SRV-DEV-02',
    hsnSac: '998314',
    sellingPrice: 85000,
    purchaseCost: 30000,
    unit: 'Flat',
    taxRate: 18,
    stock: 999,
    lowStockThreshold: 5,
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z'
  },
  {
    id: 'prod-3',
    name: 'Ergonomic Executive Office Chair',
    description: 'High-density breathable mesh, 4D adjustable armrests, lumbar support',
    type: 'Goods',
    sku: 'FURN-CHR-01',
    hsnSac: '940130',
    sellingPrice: 14500,
    purchaseCost: 8200,
    unit: 'Pcs',
    taxRate: 18,
    stock: 6,
    lowStockThreshold: 10,
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-15T10:00:00.000Z'
  },
  {
    id: 'prod-4',
    name: 'Samsung 990 PRO 2TB NVMe PCIe 4.0 SSD',
    description: 'High performance internal solid state drive with heat sink',
    type: 'Goods',
    sku: 'HW-SSD-2TB',
    hsnSac: '847170',
    sellingPrice: 17800,
    purchaseCost: 13200,
    unit: 'Pcs',
    taxRate: 18,
    stock: 28,
    lowStockThreshold: 5,
    createdAt: '2026-02-05T10:00:00.000Z',
    updatedAt: '2026-02-18T10:00:00.000Z'
  },
  {
    id: 'prod-5',
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet clicks, 8K DPI any-surface tracking, ergonomic design',
    type: 'Goods',
    sku: 'ACC-LOGI-MX3',
    hsnSac: '847160',
    sellingPrice: 8995,
    purchaseCost: 6100,
    unit: 'Pcs',
    taxRate: 18,
    stock: 3,
    lowStockThreshold: 8,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-20T10:00:00.000Z'
  },
  {
    id: 'prod-6',
    name: 'Custom Corrugated Shipping Boxes (Bundle of 100)',
    description: 'Heavy duty 3-ply brown cardboard shipping boxes (12x10x8 inch)',
    type: 'Goods',
    sku: 'PKG-BOX-100',
    hsnSac: '481910',
    sellingPrice: 2600,
    purchaseCost: 1450,
    unit: 'Boxes',
    taxRate: 12,
    stock: 42,
    lowStockThreshold: 15,
    createdAt: '2026-02-12T10:00:00.000Z',
    updatedAt: '2026-02-25T10:00:00.000Z'
  },
  {
    id: 'prod-7',
    name: 'Thermal Paper POS Rolls 80mm (Pack of 50)',
    description: 'BPA-free high sensitivity thermal paper for point-of-sale receipt printers',
    type: 'Goods',
    sku: 'POS-ROLL-80',
    hsnSac: '480254',
    sellingPrice: 1250,
    purchaseCost: 700,
    unit: 'Boxes',
    taxRate: 12,
    stock: 2,
    lowStockThreshold: 10,
    createdAt: '2026-02-15T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 'prod-8',
    name: 'UI/UX Design System & Mobile App Mockups',
    description: 'Figma component library, user journey mapping, and interactive prototypes',
    type: 'Service',
    sku: 'SRV-DSGN-01',
    hsnSac: '998311',
    sellingPrice: 32000,
    purchaseCost: 10000,
    unit: 'Days',
    taxRate: 18,
    stock: 999,
    lowStockThreshold: 5,
    createdAt: '2026-02-18T10:00:00.000Z',
    updatedAt: '2026-03-02T10:00:00.000Z'
  }
]

const STORAGE_KEY = 'inkviz_products'
const EVENT_KEY = 'inkviz_products_updated'

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS))
      return DEFAULT_PRODUCTS
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to read products from localStorage', e)
    return DEFAULT_PRODUCTS
  }
}

export function saveStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    window.dispatchEvent(new Event(EVENT_KEY))
  } catch (e) {
    console.error('Failed to save products to localStorage', e)
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS)
  const [isLoaded, setIsLoaded] = useState(false)

  const reload = useCallback(() => {
    setProducts(getStoredProducts())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    reload()
    const handleUpdate = () => reload()
    window.addEventListener(EVENT_KEY, handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [reload])

  const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...data,
      id: 'prod-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = [newProduct, ...products]
    saveStoredProducts(updated)
    setProducts(updated)
    return newProduct
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
      return item
    })
    saveStoredProducts(updated)
    setProducts(updated)
  }

  const deleteProduct = (id: string) => {
    const updated = products.filter(item => item.id !== id)
    saveStoredProducts(updated)
    setProducts(updated)
  }

  const adjustStock = (id: string, newStock: number) => {
    updateProduct(id, { stock: Math.max(0, newStock) })
  }

  return {
    products,
    isLoaded,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    reload
  }
}
