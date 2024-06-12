import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactsController,
  getContactsByIdController,
} from '../controllers/contacts.js';
import { controllerWrapper } from '../utils/contorllerWrapper.js';

const router = Router();

router.get('/contacts', controllerWrapper(getContactsController));

router.get(
  '/contacts/:contactId',
  controllerWrapper(getContactsByIdController),
);

router.post('/contacts', controllerWrapper(createContactController));

router.delete(
  'contacts/:contactId',
  controllerWrapper(deleteContactController),
);
export default router;
