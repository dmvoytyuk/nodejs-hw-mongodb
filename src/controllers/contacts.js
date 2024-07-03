import createHttpError from 'http-errors';
import {
  updateContact,
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortOrder } from '../utils/parseSortParams.js';
import { ContactsCollection } from '../db/models/contact.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res) => {
  const userId = req.user._id;
  const paginationParams = parsePaginationParams(req.query);
  const sortOrder = parseSortOrder(req.query.sortOrder);
  const sortBy = 'name';
  const contacts = await getAllContacts({
    ...paginationParams,
    sortBy,
    sortOrder,
    userId,
  });

  // if (contacts.totalPages < paginationParams.page) {
  //   next(createHttpError(404, 'No contacts found on this page'));
  //   return;
  // }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
  } else {
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  }
};

export const createContactController = async (req, res) => {
  const contactPhoto = req.file;

  const photoUrl = await saveFileToCloudinary(contactPhoto);

  const payload = { ...req.body, photo: photoUrl, userId: req.user._id };
  const contact = await createContact(payload);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
  } else {
    res.status(204).send();
  }
};

export const patchContactController = async (req, res, next) => {
  let contactPhoto = null;
  let photoUrl = null;
  const contactId = req.params.contactId;
  const userId = req.user._id;
  if (req.file) {
    contactPhoto = req.file;
    photoUrl = await saveFileToCloudinary(contactPhoto);
  }

  const result = await updateContact(contactId, userId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched contact',
    data: result.contact,
  });
};
