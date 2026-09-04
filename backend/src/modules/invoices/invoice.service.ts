import { Invoice } from './invoice.model';
import { User } from '../users/user.model';
import { generateInvoiceNumber } from '../../utils/invoiceNumber';
import { assertOwnership } from '../../utils/ownershipCheck';
import crypto from 'crypto';

const calculateTotals = (items: any[] = [], taxRate: number = 0, discountRate: number = 0) => {
  const subtotal = Number(
    items.reduce((acc, item) => {
      const itemPrice = Number(item.price !== undefined ? item.price : (item.rate !== undefined ? item.rate : 0)) || 0;
      item.price = itemPrice;
      item.quantity = Number(item.quantity) || 1;
      item.total = Number((item.quantity * itemPrice).toFixed(2));
      return acc + item.total;
    }, 0).toFixed(2)
  );

  const discountAmount = Number(((subtotal * discountRate) / 100).toFixed(2));
  const taxableAmount = Number((subtotal - discountAmount).toFixed(2));
  const taxAmount = Number(((taxableAmount * taxRate) / 100).toFixed(2));
  const totalAmount = Number((taxableAmount + taxAmount).toFixed(2));

  return { subtotal, discountAmount, taxAmount, totalAmount };
};

export const listInvoices = async (userId: string, filters: any, page: number = 1, limit: number = 10) => {
  const query: any = { userId, isDeleted: false };
  if (filters.status) query.status = filters.status;

  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    Invoice.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Invoice.countDocuments(query),
  ]);

  return {
    invoices,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const listTrash = async (userId: string) => {
  // Return all soft-deleted invoices for this user
  return await Invoice.find({ userId, isDeleted: true }).sort({ deletedAt: -1 }).lean();
};

export const createInvoice = async (userId: string, data: any) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Plan-gating MVP placeholder
  if (user.plan === 'free') {
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const invoiceCount = await Invoice.countDocuments({
      userId,
      createdAt: { $gte: currentMonthStart },
    });
    if (invoiceCount >= 100) {
      throw Object.assign(new Error('Free plan limit reached (100 invoices/month)'), { statusCode: 403, code: 'FORBIDDEN' });
    }
  }

  const { subtotal, discountAmount, taxAmount, totalAmount } = calculateTotals(
    data.items,
    data.taxRate || 0,
    data.discountRate || 0
  );

  const amountPaid = data.amountPaid || 0;
  const balanceDue = Number(Math.max(0, totalAmount - amountPaid).toFixed(2));

  const invoiceNumber = await generateInvoiceNumber(userId);
  const templateId = data.templateId || '6a99967f20362a95948ab737';

  const invoice = new Invoice({
    ...data,
    templateId,
    userId,
    invoiceNumber,
    subtotal,
    discountAmount,
    taxAmount,
    totalAmount,
    amountPaid,
    balanceDue,
  });

  await invoice.save();
  return invoice;
};

export const getInvoice = async (userId: string, invoiceId: string) => {
  return await assertOwnership(Invoice, invoiceId, userId);
};

export const updateInvoice = async (userId: string, invoiceId: string, data: any) => {
  const invoice = await assertOwnership(Invoice, invoiceId, userId);

  if (data.items || data.taxRate !== undefined || data.discountRate !== undefined) {
    const items = data.items || invoice.items;
    const taxRate = data.taxRate !== undefined ? data.taxRate : invoice.taxRate;
    const discountRate = data.discountRate !== undefined ? data.discountRate : invoice.discountRate;

    const { subtotal, discountAmount, taxAmount, totalAmount } = calculateTotals(items, taxRate, discountRate);
    data.subtotal = subtotal;
    data.discountAmount = discountAmount;
    data.taxAmount = taxAmount;
    data.totalAmount = totalAmount;
    const paid = data.amountPaid !== undefined ? data.amountPaid : (invoice.amountPaid || 0);
    data.balanceDue = Number(Math.max(0, totalAmount - paid).toFixed(2));
  } else if (data.amountPaid !== undefined) {
    data.balanceDue = Number(Math.max(0, invoice.totalAmount - data.amountPaid).toFixed(2));
  }

  Object.assign(invoice, data);
  await invoice.save();
  return invoice;
};

export const softDelete = async (userId: string, invoiceId: string) => {
  const invoice = await assertOwnership(Invoice, invoiceId, userId);
  invoice.isDeleted = true;
  invoice.deletedAt = new Date();
  await invoice.save();
};

export const restore = async (userId: string, invoiceId: string) => {
  const invoice = await Invoice.findOne({ _id: invoiceId, userId, isDeleted: true });
  
  if (!invoice) {
    throw Object.assign(new Error('Invoice not found in trash'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  // Check if trash expired (30 days) - although TTL index should handle this, good to double check
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  if (invoice.deletedAt && (new Date().getTime() - invoice.deletedAt.getTime()) > THIRTY_DAYS) {
    throw Object.assign(new Error('Invoice permanently deleted (trash expired)'), { statusCode: 400, code: 'TRASH_EXPIRED' });
  }

  invoice.isDeleted = false;
  invoice.deletedAt = undefined as any;
  await invoice.save();
  return invoice;
};

export const duplicateInvoice = async (userId: string, invoiceId: string) => {
  const invoice = await assertOwnership(Invoice, invoiceId, userId);
  
  const invoiceNumber = await generateInvoiceNumber(userId);
  
  const duplicatedData = invoice.toObject() as any;
  delete duplicatedData._id;
  delete duplicatedData.createdAt;
  delete duplicatedData.updatedAt;
  delete duplicatedData.shareToken; // don't duplicate token
  
  const newInvoice = new Invoice({
    ...duplicatedData,
    invoiceNumber,
    status: 'draft',
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // +7 days from now
  });
  
  await newInvoice.save();
  return newInvoice;
};

export const generateShareToken = async (userId: string, invoiceId: string) => {
  const invoice = await assertOwnership(Invoice, invoiceId, userId);
  
  if (!invoice.shareToken) {
    invoice.shareToken = crypto.randomUUID();
    await invoice.save();
  }
  
  return invoice;
};

export const getPublicInvoice = async (shareToken: string) => {
  const invoice = await Invoice.findOne({ shareToken, isDeleted: false })
    .populate('userId', 'name email businessProfile')
    .lean();
    
  if (!invoice) {
    throw Object.assign(new Error('Invoice not found or expired'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return invoice;
};
