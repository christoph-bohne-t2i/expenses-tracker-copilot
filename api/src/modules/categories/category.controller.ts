import type { RequestHandler } from 'express';
import {
  createCategory,
  deleteCategory,
  listCategories,
  renameCategory,
} from './category.service';
import { categoryCreateSchema, categoryRenameSchema } from './category.schema';

export const list: RequestHandler = async (req, res) => {
  const items = await listCategories(req.userId!);
  res.json(items);
};

export const create: RequestHandler = async (req, res) => {
  const { name } = categoryCreateSchema.parse(req.body);
  const created = await createCategory(req.userId!, name);
  res.status(201).json(created);
};

export const rename: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name } = categoryRenameSchema.parse(req.body);
  const updated = await renameCategory(req.userId!, id, name);
  res.json(updated);
};

export const remove: RequestHandler = async (req, res) => {
  await deleteCategory(req.userId!, req.params.id);
  res.status(204).send();
};
