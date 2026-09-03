import { Request, Response, NextFunction } from 'express';
import * as invoiceService from './invoice.service';

export const listInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, page, limit } = req.query;
    const result = await invoiceService.listInvoices((req as any).user._id, { status: status as string | undefined }, Number(page) || 1, Number(limit) || 10);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const listTrash = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoices = await invoiceService.listTrash((req as any).user._id);
    res.status(200).json({ success: true, data: { invoices } });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await invoiceService.createInvoice((req as any).user._id, req.body);
    res.status(201).json({ success: true, data: { invoice } });
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await invoiceService.getInvoice((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { invoice } });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await invoiceService.updateInvoice((req as any).user._id, req.params.id as string, req.body);
    res.status(200).json({ success: true, data: { invoice } });
  } catch (error) {
    next(error);
  }
};

export const softDelete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await invoiceService.softDelete((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { message: 'Invoice moved to trash' } });
  } catch (error) {
    next(error);
  }
};

export const restore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await invoiceService.restore((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { invoice, message: 'Invoice restored' } });
  } catch (error) {
    next(error);
  }
};
