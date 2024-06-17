import createHttpError from 'http-errors';
import {
  updateContact,
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getContactsController = async (req, res, next) => {
  const paginationParams = parsePaginationParams(req.query);
  const contacts = await getAllContacts(paginationParams);

  if (contacts.totalPages < paginationParams.page) {
    next(createHttpError(404, 'No contacts found on this page'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    // res.status(404).json({
    //   status: 404,
    //   message: 'Could not find contact',
    // });

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
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const contactId = req.params.contactId;

  const contact = await deleteContact(contactId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
  } else {
    res.status(204).send();
  }
};

export const patchContactController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const result = await updateContact(contactId, req.body);

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
