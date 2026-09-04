import { Request, Response, NextFunction } from 'express';
import * as vendorService from './vendor.service';

export const listVendors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, category, status } = req.query;
    const vendors = await vendorService.listVendors(
      (req as any).user._id,
      search as string,
      category as string,
      status as string
    );
    res.status(200).json({ success: true, data: { vendors } });
  } catch (error) {
    next(error);
  }
};

export const createVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vendor = await vendorService.createVendor((req as any).user._id, req.body);
    res.status(201).json({ success: true, data: { vendor } });
  } catch (error) {
    next(error);
  }
};

export const getVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vendor = await vendorService.getVendor((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { vendor } });
  } catch (error) {
    next(error);
  }
};

export const updateVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vendor = await vendorService.updateVendor(
      (req as any).user._id,
      req.params.id as string,
      req.body
    );
    res.status(200).json({ success: true, data: { vendor } });
  } catch (error) {
    next(error);
  }
};

export const deleteVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await vendorService.deleteVendor((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { message: 'Vendor deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
