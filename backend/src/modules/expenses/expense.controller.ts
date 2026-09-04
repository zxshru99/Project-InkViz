import { Request, Response, NextFunction } from 'express';
import * as expenseService from './expense.service';

export const listExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, category, startDate, endDate, billable } = req.query;
    const expenses = await expenseService.listExpenses(
      (req as any).user._id,
      search as string,
      category as string,
      startDate as string,
      endDate as string,
      billable as string
    );
    res.status(200).json({ success: true, data: { expenses } });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await expenseService.createExpense((req as any).user._id, req.body);
    res.status(201).json({ success: true, data: { expense } });
  } catch (error) {
    next(error);
  }
};

export const getExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await expenseService.getExpense((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { expense } });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await expenseService.updateExpense(
      (req as any).user._id,
      req.params.id as string,
      req.body
    );
    res.status(200).json({ success: true, data: { expense } });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await expenseService.deleteExpense((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { message: 'Expense deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
