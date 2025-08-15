import { ZodType } from 'zod';
import type { RequestHandler } from 'express';

type Source = 'body' | 'query' | 'params';

export const validate =
  <T>(schema: ZodType<T, any, any>, source: Source = 'body'): RequestHandler =>
  (req, _res, next) => {
    const data =
      source === 'body'
        ? req.body
        : source === 'query'
        ? req.query
        : req.params;

    const result = schema.safeParse(data);
    if (!result.success) return next(result.error);

    if (source === 'body') {
      req.body = result.data;
    } else {
      // Mutate in place instead of overwriting
      Object.assign(source === 'query' ? req.query : req.params, result.data);
    }

    next();
  };
