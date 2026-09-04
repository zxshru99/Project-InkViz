import { Vendor } from './vendor.model';
import { assertOwnership } from '../../utils/ownershipCheck';

export const listVendors = async (
  userId: string,
  search?: string,
  category?: string,
  status?: string
) => {
  const query: any = { userId };

  if (category) query.category = category;
  if (status) query.status = status;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { contactPerson: { $regex: search, $options: 'i' } },
    ];
  }

  return await Vendor.find(query).sort({ createdAt: -1 }).lean();
};

export const createVendor = async (userId: string, data: any) => {
  const vendor = new Vendor({
    ...data,
    userId,
  });

  await vendor.save();
  return vendor;
};

export const getVendor = async (userId: string, vendorId: string) => {
  return await assertOwnership(Vendor, vendorId, userId);
};

export const updateVendor = async (userId: string, vendorId: string, data: any) => {
  const vendor = await assertOwnership(Vendor, vendorId, userId);

  Object.assign(vendor, data);
  await vendor.save();
  return vendor;
};

export const deleteVendor = async (userId: string, vendorId: string) => {
  const vendor = await assertOwnership(Vendor, vendorId, userId);
  await vendor.deleteOne();
};
