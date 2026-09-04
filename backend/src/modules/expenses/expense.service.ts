import { Expense } from './expense.model';
import { assertOwnership } from '../../utils/ownershipCheck';

export const listExpenses = async (
  userId: string,
  search?: string,
  category?: string,
  startDate?: string,
  endDate?: string,
  billable?: string
) => {
  const query: any = { userId };

  if (category) query.category = category;
  if (billable !== undefined) query.billableToClient = billable === 'true';

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { vendorName: { $regex: search, $options: 'i' } },
      { expenseNumber: { $regex: search, $options: 'i' } },
      { clientName: { $regex: search, $options: 'i' } },
    ];
  }

  return await Expense.find(query).sort({ date: -1 }).lean();
};

export const createExpense = async (userId: string, data: any) => {
  const count = await Expense.countDocuments({ userId });
  const expenseNumber = `EXP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  const expense = new Expense({
    ...data,
    userId,
    expenseNumber,
  });

  await expense.save();
  return expense;
};

export const getExpense = async (userId: string, expenseId: string) => {
  return await assertOwnership(Expense, expenseId, userId);
};

export const updateExpense = async (userId: string, expenseId: string, data: any) => {
  const expense = await assertOwnership(Expense, expenseId, userId);

  Object.assign(expense, data);
  await expense.save();
  return expense;
};

export const deleteExpense = async (userId: string, expenseId: string) => {
  const expense = await assertOwnership(Expense, expenseId, userId);
  await expense.deleteOne();
};
