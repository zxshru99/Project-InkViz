import { z } from 'zod';

const itemSchema = z
  .object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0).default(1),
    price: z.number().min(0).optional(),
    rate: z.number().min(0).optional(),
  })
  .transform((item) => ({
    description: item.description,
    quantity: item.quantity,
    price: item.price !== undefined ? item.price : item.rate !== undefined ? item.rate : 0,
  }));

export const createInvoiceSchema = z.object({
  body: z.object({
    templateId: z.string().optional().default('6a99967f20362a95948ab737'),
    clientId: z.string().optional(), // Optional since they might not use address book
    clientName: z.string().optional().default('Client'),
    clientEmail: z.string().email('Invalid client email format').optional().or(z.literal('')).default('client@example.com'),
    clientAddress: z.string().optional(),
    status: z.enum(['draft', 'sent', 'published', 'paid', 'overdue']).optional().default('draft'),
    
    poNumber: z.string().optional(),
    paymentTerms: z.string().optional(),
    
    items: z.array(itemSchema).min(1, 'At least one item is required'),
    
    taxRate: z.number().min(0).max(100).optional(),
    taxLabel: z.string().optional(),
    discountRate: z.number().min(0).optional(),
    discountType: z.enum(['percentage', 'fixed']).optional(),
    shippingFee: z.number().min(0).optional(),
    amountPaid: z.number().min(0).optional(),
    currency: z.string().length(3).optional(),
    
    issueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid issue date' }).transform((val) => new Date(val).toISOString()),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid due date' }).transform((val) => new Date(val).toISOString()),
    notes: z.string().optional(),
    paymentDetails: z.string().optional(),
    
    colorScheme: z.string().optional(),
    font: z.string().optional(),
  }),
});

export const updateInvoiceSchema = z.object({
  body: z.object({
    status: z.enum(['draft', 'sent', 'published', 'paid', 'overdue']).optional(),
    clientId: z.string().optional(),
    clientName: z.string().min(1).optional(),
    clientEmail: z.string().email().optional().or(z.literal('')),
    clientAddress: z.string().optional(),
    
    poNumber: z.string().optional(),
    paymentTerms: z.string().optional(),
    
    items: z.array(itemSchema).min(1).optional(),
    
    taxRate: z.number().min(0).max(100).optional(),
    taxLabel: z.string().optional(),
    discountRate: z.number().min(0).optional(),
    discountType: z.enum(['percentage', 'fixed']).optional(),
    shippingFee: z.number().min(0).optional(),
    amountPaid: z.number().min(0).optional(),
    currency: z.string().length(3).optional(),
    
    issueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid issue date' }).transform((val) => new Date(val).toISOString()).optional(),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid due date' }).transform((val) => new Date(val).toISOString()).optional(),
    notes: z.string().optional(),
    paymentDetails: z.string().optional(),
    
    colorScheme: z.string().optional(),
    font: z.string().optional(),
  }),
});

export const listInvoicesSchema = z.object({
  query: z.object({
    status: z.enum(['draft', 'sent', 'published', 'paid', 'overdue']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).refine((val) => val <= 100, { message: 'Limit cannot exceed 100' }).optional(),
  }),
});
