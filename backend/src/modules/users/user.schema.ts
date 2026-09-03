import { z } from 'zod';

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    invoicePrefix: z.string().optional(),
    defaultCurrency: z.string().length(3).optional(),
  }),
});

export const deleteMeSchema = z.object({
  body: z.object({
    confirmText: z.string().min(1, 'Confirmation text is required'),
  }),
});
