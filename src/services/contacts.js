import { ContactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {},
    userId
}) => {
    const limit = perPage;
    const skip = page > 0 ? (page - 1) * perPage : 0;

    const contactsQuery = ContactsCollection
        .find({userId});

    if (filter.contactType) {
        contactsQuery.where('contactType').equals(filter.contactType);
    };
    if (typeof filter.isFavorite !== 'undefined' && filter.isFavorite !== null) {
        contactsQuery.where('isFavorite').equals(filter.isFavorite);
    }

    const contactsCount = await ContactsCollection
        .find()
        .merge(contactsQuery)
        .countDocuments();

    const contacts = await contactsQuery
        .skip(skip)
        .limit(limit)
        .sort({[sortBy]: sortOrder})
        .exec();

    const paginationData = calculatePaginationData(contactsCount, page, perPage );

    return {
        data: contacts,
        ...paginationData
    };
};

export const getContactById = async (contactId, userId) => {
    const contact = await ContactsCollection.findById({_id: contactId,userId});
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const updateContact = async (contactId, userId, updateData) => {
    const contact = await ContactsCollection.findByIdAndUpdate(
        {_id: contactId, userId},
        updateData,
        {
            new: true,
            runValidators: true
        }
    );
    return contact;
};

export const deleteContact = async (contactId, userId) => {
    const contact = await ContactsCollection.findByIdAndDelete({_id: contactId, userId});
    return contact;
};
