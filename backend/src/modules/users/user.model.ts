import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  plan: 'free' | 'paid';
  invoicePrefix: string;
  invoiceCounter: number;
  defaultCurrency: string;
  refreshTokenHash?: string;
  
  // Security fields
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    plan: { type: String, enum: ['free', 'paid'], default: 'free' },
    invoicePrefix: { type: String, default: 'INV-' },
    invoiceCounter: { type: Number, default: 1 },
    defaultCurrency: { type: String, default: 'USD' },
    refreshTokenHash: { type: String },
    
    // Security fields
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
