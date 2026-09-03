import { Router } from 'express';
import * as templateController from './template.controller';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

// Templates can be listed by authenticated users
router.use(requireAuth);

router.get('/', templateController.listTemplates);

export default router;
