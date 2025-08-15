import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validate } from '../../middleware/validate';
import {
  categoryCreateSchema,
  categoryIdParam,
  categoryRenameSchema,
} from './category.schema';
import { create, list, remove, rename } from './category.controller';

export const categoryRouter = Router();

categoryRouter.get('/', asyncHandler(list));
categoryRouter.post(
  '/',
  validate(categoryCreateSchema, 'body'),
  asyncHandler(create)
);
categoryRouter.patch(
  '/:id',
  validate(categoryIdParam, 'params'),
  validate(categoryRenameSchema, 'body'),
  asyncHandler(rename)
);
categoryRouter.delete(
  '/:id',
  validate(categoryIdParam, 'params'),
  asyncHandler(remove)
);
