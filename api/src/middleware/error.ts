import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/httpError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      title: 'Validation Error',
      status: 400,
      errors: err.issues,
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: err.status,
      title: err.title,
      message: err.message,
      details: err.details,
    });
  }

  const status = (err as any).status ?? 500;
  const body = {
    title: (err as any).title ?? 'Internal Server Error',
    status,
    message: err.message ?? 'Unexpected error',
    details: (err as any).details,
  };

  if (status >= 500) {
    console.error(err);
  }

  return res.status(status).json(body);
};
