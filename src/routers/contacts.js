import { Router } from 'express';
import {
  getContactcsController,
  getContactsByIdController,
} from '../controllers/contacts.js';
import { controllerWrapper } from '../utils/contorllerWrapper.js';

const router = Router();

router.get('/contacts', controllerWrapper(getContactcsController));

router.get(
  '/contacts/:contactId',
  controllerWrapper(getContactsByIdController),
);

export default router;
