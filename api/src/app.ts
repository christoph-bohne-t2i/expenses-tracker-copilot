import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { expenseRouter } from './modules/expenses/expense.route';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/error';
import { authRouter } from './modules/auth/auth.routes';
import { requireAuth } from './middleware/auth';
import { categoryRouter } from './modules/categories/category.route';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

  app.use('/auth', authRouter);
  app.use('/categories', requireAuth, categoryRouter);
  app.use('/expenses', requireAuth, expenseRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
