import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  userId,
}) => {
  // try {
  const skip = (page - 1) * perPage;

  const totalContacts = await ContactsCollection.countDocuments().where({
    userId: userId,
  });
  const limitedContacts = await ContactsCollection.find()
    .where({ userId: userId })
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calculatePaginationData(totalContacts, page, perPage);

  return {
    data: limitedContacts,
    ...paginationData,
  };
  // } catch (e) {
  // console.log('Error getting contacts', e);
  // }
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findById(contactId).where({
    userId: userId,
  });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  }).where({ userId: userId });
  return contact;
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  ).where({ userId: userId });

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
  };
};
