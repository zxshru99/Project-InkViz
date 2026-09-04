import { User } from './user.model';
import { Invoice } from '../invoices/invoice.model';
import { NotFoundError } from '../../utils/ownershipCheck';

const SAFE_USER_FIELDS = '-passwordHash -refreshTokenHash -emailVerificationToken -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil';

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select(SAFE_USER_FIELDS);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

export const updateMe = async (userId: string, data: any) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
    returnDocument: 'after',
  }).select(SAFE_USER_FIELDS);

  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

export const exportData = async (userId: string) => {
  const user = await User.findById(userId).select(SAFE_USER_FIELDS).lean();
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const invoices = await Invoice.find({ userId }).lean();

  return {
    user,
    invoices,
    exportDate: new Date().toISOString(),
  };
};

export const deleteMe = async (userId: string, confirmText: string) => {
  // CONFIRM_TEXT_MISMATCH (400) logic from Blueprint/PRD (case-insensitive & trimmed)
  if (!confirmText || confirmText.trim().toLowerCase() !== 'delete my account') {
    throw Object.assign(new Error('Confirmation text does not match'), { 
      statusCode: 400, 
      code: 'CONFIRM_TEXT_MISMATCH' 
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Delete all user invoices
  await Invoice.deleteMany({ userId });

  // Delete user
  await User.findByIdAndDelete(userId);
};
