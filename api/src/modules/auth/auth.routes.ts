import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';
import { loginSchema, registerSchema } from './auth.schema';
import { postLogin, postLogout, postRegister } from './auth.controller';

export const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerSchema, 'body'),
  asyncHandler(postRegister)
);
authRouter.post(
  '/login',
  validate(loginSchema, 'body'),
  asyncHandler(postLogin)
);
authRouter.post('/logout', asyncHandler(postLogout));
