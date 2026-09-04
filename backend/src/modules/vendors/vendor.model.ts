import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  category: string;
  gstin?: string;
  address?: string;
  paymentTerms: string;
  totalPurchased: number;
  balanceOwed: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, default: '' },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    category: { type: String, default: 'General' },
    gstin: { type: String, default: '' },
    address: { type: String, default: '' },
    paymentTerms: { type: String, default: 'Net 30' },
    totalPurchased: { type: Number, default: 0, min: 0 },
    balanceOwed: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  {
    timestamps: true,
  }
);

vendorSchema.index({ userId: 1, email: 1 });
vendorSchema.index({ userId: 1, name: 1 });

export const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema);
