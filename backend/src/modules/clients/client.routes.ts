import { Router } from 'express';
import * as clientController from './client.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import {
  createClientSchema,
  updateClientSchema,
  listClientsSchema,
} from './client.schema';

const router = Router();

// All client routes require authentication
router.use(requireAuth);

router.get('/', validate(listClientsSchema), clientController.listClients);
router.post('/', validate(createClientSchema), clientController.createClient);

router.get('/:id', clientController.getClient);
router.patch('/:id', validate(updateClientSchema), clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;
