import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await ContactsCollection.find();
    return contacts;
  } catch (e) {
    console.log('Error getting contacts', e);
  }
};

export const getContactById = async (contactId) => {
  try {
    const contacts = await ContactsCollection.findById(contactId);
    return contacts;
  } catch (e) {
    console.log('Error getting contact', e);
  }
};
