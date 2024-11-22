import {
    getAllContacts,
    getContactById,
    createContact
} from "../services/contacts.js";
import createHttpError from "http-errors";


export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
        throw new createHttpError(404, "Contact not found!");
    };

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
    });
};

export const createContactsController = async (req, res, next) => {

    const {name, phoneNumber, email, isFavorite, contactType} = req.body;
    const contact = await createContact({name, phoneNumber, email, isFavorite, contactType});

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact
    });
};
