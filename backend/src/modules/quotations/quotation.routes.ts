import { Router } from 'express';
import * as quotationController from './quotation.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import {
  createQuotationSchema,
  updateQuotationSchema,
  listQuotationsSchema,
} from './quotation.schema';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listQuotationsSchema), quotationController.listQuotations);
router.post('/', validate(createQuotationSchema), quotationController.createQuotation);

router.get('/:id', quotationController.getQuotation);
router.patch('/:id', validate(updateQuotationSchema), quotationController.updateQuotation);
router.post('/:id/convert', quotationController.convertToInvoice);
router.delete('/:id', quotationController.deleteQuotation);

export default router;
