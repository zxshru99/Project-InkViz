import { Router } from 'express';
import * as invoiceController from './invoice.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  listInvoicesSchema,
} from './invoice.schema';

const router = Router();

// All invoice routes require authentication
router.use(requireAuth);

router.get('/', validate(listInvoicesSchema), invoiceController.listInvoices);
router.post('/', validate(createInvoiceSchema), invoiceController.createInvoice);

// Trash endpoints
router.get('/trash', invoiceController.listTrash);

// Individual invoice endpoints
router.get('/:id', invoiceController.getInvoice);
router.patch('/:id', validate(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete('/:id', invoiceController.softDelete);
router.post('/:id/restore', invoiceController.restore);
router.post('/:id/duplicate', invoiceController.duplicateInvoice);
router.post('/:id/share', invoiceController.shareInvoice);

export default router;
