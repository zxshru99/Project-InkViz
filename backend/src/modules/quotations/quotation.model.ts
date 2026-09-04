import mongoose, { Schema, Document } from 'mongoose';

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired';

export interface IQuotationItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  hsnCode?: string;
  unit?: string;
}

export interface IQuotation extends Document {
  userId: mongoose.Types.ObjectId;
  quotationNumber: string;
  clientName: string;
  clientEmail: string;
  date: string;
  expiryDate: string;
  items: IQuotationItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: QuotationStatus;
  convertedToInvoiceId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const quotationItemSchema = new Schema<IQuotationItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    rate: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 },
    hsnCode: { type: String, default: '' },
    unit: { type: String, default: 'Pcs' },
  },
  { _id: false }
);

const quotationSchema = new Schema<IQuotation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quotationNumber: { type: String, required: true, trim: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    date: { type: String, required: true },
    expiryDate: { type: String, required: true },
    items: [quotationItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'],
      default: 'Draft',
    },
    convertedToInvoiceId: { type: String, default: null },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

quotationSchema.index({ userId: 1, quotationNumber: 1 });
quotationSchema.index({ userId: 1, status: 1 });

export const Quotation = mongoose.model<IQuotation>('Quotation', quotationSchema);
