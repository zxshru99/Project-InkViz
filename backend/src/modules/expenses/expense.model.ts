import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  expenseNumber: string;
  title: string;
  category: string;
  vendorName: string;
  amount: number;
  taxDeductible: boolean;
  taxAmount: number;
  date: string;
  paymentMethod: string;
  billableToClient: boolean;
  clientId?: mongoose.Types.ObjectId;
  clientName?: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expenseNumber: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    vendorName: { type: String, default: '' },
    amount: { type: Number, required: true, min: 0 },
    taxDeductible: { type: Boolean, default: true },
    taxAmount: { type: Number, default: 0, min: 0 },
    date: { type: String, required: true },
    paymentMethod: { type: String, default: 'Credit Card' },
    billableToClient: { type: Boolean, default: false },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    clientName: { type: String, default: '' },
    receiptUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
