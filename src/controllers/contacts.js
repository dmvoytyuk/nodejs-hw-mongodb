import createHttpError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';

export const getContactcsController = async (_req, res) => {
  const contacts = await getAllContacts();
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

    next(createHttpError(404, 'Student not found'));
  } else {
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  }
};
