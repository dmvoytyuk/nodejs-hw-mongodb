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

router.get('', controllerWrapper(getContactsController));

router.get('/:contactId', controllerWrapper(getContactsByIdController));

router.post(
  '',
  validateBody(createContactSchema),
  controllerWrapper(createContactController),
);

router.delete('/:contactId', controllerWrapper(deleteContactController));

router.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  controllerWrapper(patchContactController),
);

export default router;
