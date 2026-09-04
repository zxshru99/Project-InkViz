import { Request, Response, NextFunction } from 'express';
import * as quotationService from './quotation.service';

export const listQuotations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, status } = req.query;
    const quotations = await quotationService.listQuotations(
      (req as any).user._id,
      search as string,
      status as string
    );
    res.status(200).json({ success: true, data: { quotations } });
  } catch (error) {
    next(error);
  }
};

export const createQuotation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quotation = await quotationService.createQuotation((req as any).user._id, req.body);
    res.status(201).json({ success: true, data: { quotation } });
  } catch (error) {
    next(error);
  }
};

export const getQuotation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quotation = await quotationService.getQuotation((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { quotation } });
  } catch (error) {
    next(error);
  }
};

export const updateQuotation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quotation = await quotationService.updateQuotation(
      (req as any).user._id,
      req.params.id as string,
      req.body
    );
    res.status(200).json({ success: true, data: { quotation } });
  } catch (error) {
    next(error);
  }
};

export const convertToInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { invoiceId } = req.body;
    const quotation = await quotationService.convertToInvoice(
      (req as any).user._id,
      req.params.id as string,
      invoiceId
    );
    res.status(200).json({ success: true, data: { quotation } });
  } catch (error) {
    next(error);
  }
};

export const deleteQuotation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await quotationService.deleteQuotation((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { message: 'Quotation deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
