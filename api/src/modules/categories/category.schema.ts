import { z } from 'zod';

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(50),
});

export const categoryRenameSchema = categoryCreateSchema;

export const categoryIdParam = z.object({
  id: z.string().min(1),
});
