import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validate } from '../../middleware/validate';
import { create, list, remove } from './expense.controller';
import {
  expenseCreateSchema,
  expenseIdParam,
  expenseListQuery,
} from './expense.schema';

export const expenseRouter = Router();

expenseRouter.get('/', validate(expenseListQuery, 'query'), asyncHandler(list));

expenseRouter.post(
  '/',
  validate(expenseCreateSchema, 'body'),
  asyncHandler(create)
);

expenseRouter.delete(
  '/:id',
  validate(expenseIdParam, 'params'),
  asyncHandler(remove)
);
