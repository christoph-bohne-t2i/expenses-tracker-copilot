import { RequestHandler } from 'express';
import { createExpense, deleteExpense, listExpenses } from './expense.service';
import { expenseCreateSchema, expenseListQuery } from './expense.schema';
import { HttpError } from '../../utils/httpError';

export const list: RequestHandler = async (req, res) => {
  const { from, to, categoryId } = expenseListQuery.parse(req.query);
  const items = await listExpenses(req.userId!, { from, to, categoryId });
  res.json(items);
};

export const create: RequestHandler = async (req, res) => {
  const { description, amount, date, categoryId } = expenseCreateSchema.parse(
    req.body
  );
  const created = await createExpense(req.userId!, {
    description,
    amount,
    date,
    categoryId: categoryId ?? null,
  });
  res.status(201).json(created);
};

export const remove: RequestHandler = async (req, res) => {
  const ok = await deleteExpense(req.userId!, req.params.id);
  if (!ok) throw new HttpError(404, 'Expense not found');
  res.status(204).send();
};
