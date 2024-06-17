import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder }) => {
  // try {
  const skip = (page - 1) * perPage;

  const countContacts = await ContactsCollection.countDocuments();
  const limitedContacts = await ContactsCollection.find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calculatePaginationData(countContacts, page, perPage);

  return {
    data: limitedContacts,
    ...paginationData,
  };
  // } catch (e) {
  // console.log('Error getting contacts', e);
  // }
};

export const getContactById = async (contactId) => {
  try {
    const contacts = await ContactsCollection.findById(contactId);
    return contacts;
  } catch (e) {
    console.log('Error getting contact', e);
  }
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
  };
};
