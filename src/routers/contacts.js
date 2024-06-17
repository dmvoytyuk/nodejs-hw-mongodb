import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactsController,
  getContactsByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { controllerWrapper } from '../utils/contorllerWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.get('/contacts', controllerWrapper(getContactsController));

router.get(
  '/contacts/:contactId',
  controllerWrapper(getContactsByIdController),
);

router.post(
  '/contacts',
  validateBody(createContactSchema),
  controllerWrapper(createContactController),
);

router.delete(
  '/contacts/:contactId',
  controllerWrapper(deleteContactController),
);

router.patch(
  '/contacts/:contactId',
  validateBody(updateContactSchema),
  controllerWrapper(patchContactController),
);

export default router;
