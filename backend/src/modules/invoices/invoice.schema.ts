import { z } from 'zod';

const itemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0),
  price: z.number().min(0),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    templateId: z.string().min(1, 'Template ID is required'),
    clientName: z.string().min(1, 'Client name is required'),
    clientEmail: z.string().email('Invalid client email format'),
    clientAddress: z.string().optional(),
    
    items: z.array(itemSchema).min(1, 'At least one item is required'),
    
    taxRate: z.number().min(0).max(100).optional(),
    discountRate: z.number().min(0).max(100).optional(),
    currency: z.string().length(3).optional(),
    
    issueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid issue date' }).transform((val) => new Date(val).toISOString()),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid due date' }).transform((val) => new Date(val).toISOString()),
    notes: z.string().optional(),
    
    colorScheme: z.string().optional(),
    font: z.string().optional(),
  }),
});

export const updateInvoiceSchema = z.object({
  body: z.object({
    status: z.enum(['draft', 'sent', 'paid', 'overdue']).optional(),
    clientName: z.string().min(1).optional(),
    clientEmail: z.string().email().optional(),
    clientAddress: z.string().optional(),
    
    items: z.array(itemSchema).min(1).optional(),
    
    taxRate: z.number().min(0).max(100).optional(),
    discountRate: z.number().min(0).max(100).optional(),
    currency: z.string().length(3).optional(),
    
    issueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid issue date' }).transform((val) => new Date(val).toISOString()).optional(),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid due date' }).transform((val) => new Date(val).toISOString()).optional(),
    notes: z.string().optional(),
    
    colorScheme: z.string().optional(),
    font: z.string().optional(),
  }),
});

export const listInvoicesSchema = z.object({
  query: z.object({
    status: z.enum(['draft', 'sent', 'paid', 'overdue']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).refine((val) => val <= 100, { message: 'Limit cannot exceed 100' }).optional(),
  }),
});
