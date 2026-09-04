import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    type: z.enum(['Goods', 'Service']).default('Goods'),
    sku: z.string().min(1, 'SKU is required'),
    hsnSac: z.string().optional(),
    sellingPrice: z.number().min(0, 'Selling price must be non-negative'),
    purchaseCost: z.number().min(0).optional(),
    unit: z
      .enum(['Pcs', 'Hrs', 'Days', 'Kg', 'Grams', 'Boxes', 'Liters', 'Meters', 'Flat'])
      .default('Pcs'),
    taxRate: z.number().min(0).max(100).default(18),
    stock: z.number().default(0),
    lowStockThreshold: z.number().default(5),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z.enum(['Goods', 'Service']).optional(),
    sku: z.string().min(1).optional(),
    hsnSac: z.string().optional(),
    sellingPrice: z.number().min(0).optional(),
    purchaseCost: z.number().min(0).optional(),
    unit: z.enum(['Pcs', 'Hrs', 'Days', 'Kg', 'Grams', 'Boxes', 'Liters', 'Meters', 'Flat']).optional(),
    taxRate: z.number().min(0).max(100).optional(),
    stock: z.number().optional(),
    lowStockThreshold: z.number().optional(),
  }),
});

export const adjustStockSchema = z.object({
  body: z.object({
    adjustment: z.number(), // positive or negative
    stock: z.number().optional(), // or set absolute stock
    reason: z.string().optional(),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    type: z.enum(['Goods', 'Service']).optional(),
  }),
});
