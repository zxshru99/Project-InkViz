import { z } from 'zod';

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    invoicePrefix: z.string().optional(),
    defaultCurrency: z.string().length(3).optional(),
    businessProfile: z.object({
      companyName: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      website: z.string().optional(),
      logoUrl: z.string().optional(),
      taxId: z.string().optional(),
    }).optional(),
    preferences: z.object({
      themeColor: z.string().optional(),
      defaultPaymentTerms: z.string().optional(),
    }).optional(),
  }),
});

export const deleteMeSchema = z.object({
  body: z.object({
    confirmText: z.string().min(1, 'Confirmation text is required'),
  }),
});
