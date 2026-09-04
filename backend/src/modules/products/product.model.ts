import mongoose, { Schema, Document } from 'mongoose';

export type ProductUnit = 'Pcs' | 'Hrs' | 'Days' | 'Kg' | 'Grams' | 'Boxes' | 'Liters' | 'Meters' | 'Flat';
export type ProductType = 'Goods' | 'Service';

export interface IProduct extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  type: ProductType;
  sku: string;
  hsnSac?: string;
  sellingPrice: number;
  purchaseCost?: number;
  unit: ProductUnit;
  taxRate: number;
  stock: number;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['Goods', 'Service'], default: 'Goods' },
    sku: { type: String, required: true, trim: true },
    hsnSac: { type: String, default: '' },
    sellingPrice: { type: Number, required: true, min: 0 },
    purchaseCost: { type: Number, default: 0, min: 0 },
    unit: {
      type: String,
      enum: ['Pcs', 'Hrs', 'Days', 'Kg', 'Grams', 'Boxes', 'Liters', 'Meters', 'Flat'],
      default: 'Pcs',
    },
    taxRate: { type: Number, default: 18, min: 0 },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ userId: 1, sku: 1 }, { unique: true });
productSchema.index({ userId: 1, name: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
