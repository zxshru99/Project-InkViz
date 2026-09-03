import { User } from '../modules/users/user.model';

/**
 * Atomically increments the invoice counter for a user and returns a formatted invoice number.
 * Example: if prefix is "INV-" and counter becomes 1, returns "INV-0001".
 */
export const generateInvoiceNumber = async (userId: string): Promise<string> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { invoiceCounter: 1 } },
    { new: true, select: 'invoicePrefix invoiceCounter' }
  );

  if (!user) {
    throw new Error('User not found while generating invoice number');
  }

  const prefix = user.invoicePrefix || 'INV-';
  const paddedCounter = String(user.invoiceCounter).padStart(4, '0');
  
  return `${prefix}${paddedCounter}`;
};
