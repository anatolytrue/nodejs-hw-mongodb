import express from "express";

import {
    getContactsController,
    getContactByIdController,
    createContactsController,
    patchContactController,
    deleteContactController
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

const jsonParser = express.json();
const router = express.Router();

router.get(
    '/contacts',
    ctrlWrapper(getContactsController)
);
router.get(
    '/contacts/:contactId',
    isValidId,
    ctrlWrapper(getContactByIdController)
);
router.post(
    "/contacts",
    jsonParser,
    validateBody(createContactSchema),
    ctrlWrapper(createContactsController)
);
router.patch(
    "/contacts/:contactId",
    isValidId,
    jsonParser,
    validateBody(updateContactSchema),
    ctrlWrapper(patchContactController)
);
router.delete(
    "/contacts/:contactId",
    isValidId,
    ctrlWrapper(deleteContactController)
);

export default router;
