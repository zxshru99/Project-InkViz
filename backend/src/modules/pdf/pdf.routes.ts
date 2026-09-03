import { Router } from 'express';
import * as pdfController from './pdf.controller';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

// All PDF routes require authentication
router.use(requireAuth);

router.get('/invoices/:id/download', pdfController.downloadInvoicePdf);

export default router;
