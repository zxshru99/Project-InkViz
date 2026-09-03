import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string; // e.g., 'Modern', 'Classic', 'Minimal'
  description?: string;
  thumbnailUrl?: string; // S3/GCS URL or base64 thumbnail
  isActive: boolean;
  htmlContent: string; // The Handlebars/EJS or raw HTML string with variables
  
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    thumbnailUrl: { type: String },
    isActive: { type: Boolean, default: true },
    htmlContent: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Template = mongoose.model<ITemplate>('Template', templateSchema);
