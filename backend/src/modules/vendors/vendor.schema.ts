import { z } from 'zod';

export const createVendorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Vendor name is required'),
    contactPerson: z.string().optional(),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    category: z.string().default('General'),
    gstin: z.string().optional(),
    address: z.string().optional(),
    paymentTerms: z.string().default('Net 30'),
    totalPurchased: z.number().min(0).default(0),
    balanceOwed: z.number().min(0).default(0),
    status: z.enum(['Active', 'Inactive']).default('Active'),
  }),
});

export const updateVendorSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    contactPerson: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    category: z.string().optional(),
    gstin: z.string().optional(),
    address: z.string().optional(),
    paymentTerms: z.string().optional(),
    totalPurchased: z.number().min(0).optional(),
    balanceOwed: z.number().min(0).optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),
});

export const listVendorsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),
});
