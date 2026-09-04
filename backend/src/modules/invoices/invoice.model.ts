import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId | string;
  clientId?: mongoose.Types.ObjectId; // Link to Client address book
  
  invoiceNumber: string; // e.g., INV-0001
  poNumber?: string;
  paymentTerms?: string;
  status: 'draft' | 'sent' | 'published' | 'paid' | 'overdue';
  
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  
  items: IInvoiceItem[];
  
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  taxLabel?: string; // e.g., 'Tax', 'VAT', 'GST'
  discountRate: number;
  discountAmount: number;
  discountType?: 'percentage' | 'fixed';
  shippingFee?: number;
  totalAmount: number;
  amountPaid?: number;
  balanceDue?: number;
  currency: string;
  
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  paymentDetails?: string;
  
  shareToken?: string; // unique token for public sharing
  
  // Customization
  colorScheme?: string;
  font?: string;
  signatureUrl?: string; // S3/GCS URL or base64
  
  // Soft Delete
  isDeleted: boolean;
  deletedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
});

const invoiceSchema = new Schema<IInvoice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: Schema.Types.Mixed, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    
    invoiceNumber: { type: String, required: true },
    poNumber: { type: String },
    paymentTerms: { type: String },
    status: { type: String, enum: ['draft', 'sent', 'published', 'paid', 'overdue'], default: 'draft' },
    
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientAddress: { type: String },
    
    items: [itemSchema],
    
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    taxAmount: { type: Number, default: 0, min: 0 },
    taxLabel: { type: String, default: 'Tax' },
    discountRate: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    shippingFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    balanceDue: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    notes: { type: String },
    paymentDetails: { type: String },
    
    shareToken: { type: String, unique: true, sparse: true },
    
    colorScheme: { type: String },
    font: { type: String },
    signatureUrl: { type: String },
    
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast dashboard queries
invoiceSchema.index({ userId: 1, isDeleted: 1, status: 1 });
// TTL index for soft-delete auto-purge (30 days = 2592000 seconds)
invoiceSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 2592000 });

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
