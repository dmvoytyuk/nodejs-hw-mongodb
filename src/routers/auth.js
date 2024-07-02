import { Router } from 'express';
import { loginUserSchema, registerUserSchema } from '../validation/user.js';
import { controllerWrapper } from '../utils/contorllerWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  requestResetEmailController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { requestResetEmailSchema } from '../validation/email.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  controllerWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  controllerWrapper(loginUserController),
);

router.post('/logout', controllerWrapper(logoutUserController));

router.post('/refresh', controllerWrapper(refreshSessionController));

router.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  controllerWrapper(requestResetEmailController),
);

export default router;
