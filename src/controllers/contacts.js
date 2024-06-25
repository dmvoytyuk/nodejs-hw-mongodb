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
  const payload = { ...req.body, userId: req.user._id };
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
  const contactId = req.params.contactId;
  const userId = req.user._id;
  const result = await updateContact(contactId, userId, req.body);

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
