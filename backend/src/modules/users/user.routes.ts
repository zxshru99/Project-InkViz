import { Router } from 'express';
import * as userController from './user.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { updateMeSchema, deleteMeSchema } from './user.schema';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

router.get('/me', userController.getMe);
router.patch('/me', validate(updateMeSchema), userController.updateMe);
router.get('/me/export', userController.exportData);
router.delete('/me', validate(deleteMeSchema), userController.deleteMe);

export default router;
