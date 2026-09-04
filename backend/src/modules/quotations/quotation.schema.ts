import { z } from 'zod';

const quotationItemZod = z.object({
  description: z.string().min(1, 'Item description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().min(0, 'Rate must be non-negative'),
  amount: z.number().min(0),
  hsnCode: z.string().optional(),
  unit: z.string().optional(),
});

export const createQuotationSchema = z.object({
  body: z.object({
    clientName: z.string().min(1, 'Client name is required'),
    clientEmail: z.string().email('Invalid email address'),
    date: z.string().min(1, 'Date is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
    items: z.array(quotationItemZod).min(1, 'At least one line item is required'),
    subtotal: z.number().min(0),
    taxAmount: z.number().min(0).default(0),
    total: z.number().min(0),
    status: z.enum(['Draft', 'Sent', 'Accepted', 'Declined', 'Expired']).default('Draft'),
    notes: z.string().optional(),
  }),
});

export const updateQuotationSchema = z.object({
  body: z.object({
    clientName: z.string().min(1).optional(),
    clientEmail: z.string().email().optional(),
    date: z.string().optional(),
    expiryDate: z.string().optional(),
    items: z.array(quotationItemZod).min(1).optional(),
    subtotal: z.number().min(0).optional(),
    taxAmount: z.number().min(0).optional(),
    total: z.number().min(0).optional(),
    status: z.enum(['Draft', 'Sent', 'Accepted', 'Declined', 'Expired']).optional(),
    notes: z.string().optional(),
  }),
});

export const listQuotationsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['Draft', 'Sent', 'Accepted', 'Declined', 'Expired']).optional(),
  }),
});
