import { Router } from 'express';
import * as vendorController from './vendor.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import {
  createVendorSchema,
  updateVendorSchema,
  listVendorsSchema,
} from './vendor.schema';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listVendorsSchema), vendorController.listVendors);
router.post('/', validate(createVendorSchema), vendorController.createVendor);

router.get('/:id', vendorController.getVendor);
router.patch('/:id', validate(updateVendorSchema), vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

export default router;
