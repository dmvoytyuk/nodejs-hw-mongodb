import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactsController,
  getContactsByIdController,
  patchContactController,
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
  '/contacts/:contactId',
  controllerWrapper(deleteContactController),
);

router.patch('/contacts/:contactId', controllerWrapper(patchContactController));

export default router;
