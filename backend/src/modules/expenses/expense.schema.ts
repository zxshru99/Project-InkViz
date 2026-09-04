import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Expense title is required'),
    category: z.string().min(1, 'Category is required'),
    vendorName: z.string().optional(),
    amount: z.number().min(0, 'Amount must be non-negative'),
    taxDeductible: z.boolean().default(true),
    taxAmount: z.number().min(0).default(0),
    date: z.string().min(1, 'Date is required'),
    paymentMethod: z.string().default('Credit Card'),
    billableToClient: z.boolean().default(false),
    clientId: z.string().optional(),
    clientName: z.string().optional(),
    receiptUrl: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    vendorName: z.string().optional(),
    amount: z.number().min(0).optional(),
    taxDeductible: z.boolean().optional(),
    taxAmount: z.number().min(0).optional(),
    date: z.string().optional(),
    paymentMethod: z.string().optional(),
    billableToClient: z.boolean().optional(),
    clientId: z.string().optional(),
    clientName: z.string().optional(),
    receiptUrl: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const listExpensesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    billable: z.string().optional(),
  }),
});
