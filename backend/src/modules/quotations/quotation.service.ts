import { Quotation } from './quotation.model';
import { assertOwnership } from '../../utils/ownershipCheck';

export const listQuotations = async (userId: string, search?: string, status?: string) => {
  const query: any = { userId };

  if (status) query.status = status;

  if (search) {
    query.$or = [
      { quotationNumber: { $regex: search, $options: 'i' } },
      { clientName: { $regex: search, $options: 'i' } },
      { clientEmail: { $regex: search, $options: 'i' } },
    ];
  }

  return await Quotation.find(query).sort({ createdAt: -1 }).lean();
};

export const createQuotation = async (userId: string, data: any) => {
  const count = await Quotation.countDocuments({ userId });
  const quotationNumber = `EST-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  const quotation = new Quotation({
    ...data,
    userId,
    quotationNumber,
  });

  await quotation.save();
  return quotation;
};

export const getQuotation = async (userId: string, quotationId: string) => {
  return await assertOwnership(Quotation, quotationId, userId);
};

export const updateQuotation = async (userId: string, quotationId: string, data: any) => {
  const quotation = await assertOwnership(Quotation, quotationId, userId);

  Object.assign(quotation, data);
  await quotation.save();
  return quotation;
};

export const convertToInvoice = async (userId: string, quotationId: string, invoiceId: string) => {
  const quotation = await assertOwnership(Quotation, quotationId, userId);
  quotation.status = 'Accepted';
  quotation.convertedToInvoiceId = invoiceId;
  await quotation.save();
  return quotation;
};

export const deleteQuotation = async (userId: string, quotationId: string) => {
  const quotation = await assertOwnership(Quotation, quotationId, userId);
  await quotation.deleteOne();
};
