import { ContactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({ page, perPage }) => {
    const limit = perPage;
    const skip = page > 0 ? (page - 1) * perPage : 0;

    const contactsQuery = ContactsCollection.find();
    const contactsCount = await ContactsCollection.find().merge(contactsQuery).countDocuments();


    const contacts = await contactsQuery.skip(skip).limit(limit).exec();
    const paginationData = calculatePaginationData(contactsCount, page, perPage);
    return {
        data: contacts,
        ...paginationData
    };
};

export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const updateContact = async (contactId, updateData) => {
    const contact = await ContactsCollection.findByIdAndUpdate(
        contactId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );
    return contact;
};

export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findByIdAndDelete(contactId);
    return contact;
};
