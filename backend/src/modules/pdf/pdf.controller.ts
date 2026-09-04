import { Request, Response, NextFunction } from 'express';
import * as pdfService from './pdf.service';

export const downloadInvoicePdf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pdfBuffer = await pdfService.generateInvoicePdf((req as any).user._id, req.params.id as string);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${req.params.id as string}.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const downloadPublicInvoicePdf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pdfBuffer = await pdfService.generatePublicInvoicePdf(req.params.token as string);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${req.params.token as string}.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
