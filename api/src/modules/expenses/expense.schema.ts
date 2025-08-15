import { z } from 'zod';

export const expenseCreateSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  date: z.coerce.date(), // accepts string/number → Date
  categoryId: z.string().optional().nullable(),
});

export const expenseListQuery = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  categoryId: z.string().optional(),
});

export const expenseIdParam = z.object({
  id: z.string().min(1),
});
