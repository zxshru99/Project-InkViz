import { Router } from 'express';
import * as productController from './product.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import {
  createProductSchema,
  updateProductSchema,
  adjustStockSchema,
  listProductsSchema,
} from './product.schema';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listProductsSchema), productController.listProducts);
router.post('/', validate(createProductSchema), productController.createProduct);

router.get('/:id', productController.getProduct);
router.patch('/:id', validate(updateProductSchema), productController.updateProduct);
router.post('/:id/stock', validate(adjustStockSchema), productController.adjustStock);
router.delete('/:id', productController.deleteProduct);

export default router;
