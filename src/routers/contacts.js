import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactsController,
  getContactsByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { controllerWrapper } from '../utils/contorllerWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('', controllerWrapper(getContactsController));

router.get('/:contactId', controllerWrapper(getContactsByIdController));

router.post(
  '',
  upload.single('photo'),
  validateBody(createContactSchema),
  controllerWrapper(createContactController),
);

router.delete('/:contactId', controllerWrapper(deleteContactController));

router.patch(
  '/:contactId',
  upload.single('photo'),
  validateBody(updateContactSchema),
  controllerWrapper(patchContactController),
);

export default router;
