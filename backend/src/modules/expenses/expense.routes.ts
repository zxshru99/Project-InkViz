import { Router } from 'express';
import * as expenseController from './expense.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import {
  createExpenseSchema,
  updateExpenseSchema,
  listExpensesSchema,
} from './expense.schema';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listExpensesSchema), expenseController.listExpenses);
router.post('/', validate(createExpenseSchema), expenseController.createExpense);

router.get('/:id', expenseController.getExpense);
router.patch('/:id', validate(updateExpenseSchema), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;
