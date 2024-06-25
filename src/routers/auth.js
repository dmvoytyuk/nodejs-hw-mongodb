import { Router } from 'express';
import { loginUserSchema, registerUserSchema } from '../validation/user.js';
import { controllerWrapper } from '../utils/contorllerWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

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

export default router;
