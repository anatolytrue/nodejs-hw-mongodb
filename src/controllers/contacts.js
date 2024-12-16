import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { env } from "../utils/env.js";


export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId: req.user._id
    });

    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
        throw new createHttpError(404, "Contact not found!");
    };

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
    });
};

export const createContactsController = async (req, res) => {

    const {
        name,
        phoneNumber,
        email,
        isFavorite,
        contactType
    } = req.body;
    const photo = req.file;

    let photoUrl;
    if (photo) {
        photoUrl = await saveFileToCloudinary(photo);
    }

    const newContact = await createContact({
        name,
        phoneNumber,
        email,
        isFavorite,
        contactType,
        userId: req.user._id,
        photo: photoUrl
    });

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: newContact
    });
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavorite: req.body.isFavorite,
        contactType: req.body.contactType,
        ...(photoUrl && { photo: photoUrl })
    };

    const updatedContact = await updateContact(
        contactId,
        req.user._id,
        contact,
    );

    if (!updatedContact) {
        throw new createHttpError.NotFound('Student not found');
    };

        res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: updatedContact
    });
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;

    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
        throw new createHttpError.NotFound('Contact not found');
    }

    res.status(204).send();
};
