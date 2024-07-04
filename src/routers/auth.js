import { Router } from 'express';
import { loginUserSchema, registerUserSchema } from '../validation/user.js';
import { controllerWrapper } from '../utils/contorllerWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { requestResetEmailSchema } from '../validation/email.js';
import { resetLinkSchema } from '../validation/resetLink.js';

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
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  controllerWrapper(requestResetEmailController),
);

router.post(
  '/reset-password',
  validateBody(resetLinkSchema),
  controllerWrapper(resetPasswordController),
);

export default router;
