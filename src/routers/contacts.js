import express from "express";

import {
    getContactsController,
    getContactByIdController,
    createContactsController,
    patchContactController,
    deleteContactController
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";


const jsonParser = express.json();
const router = express.Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post("/contacts",jsonParser, ctrlWrapper(createContactsController));
router.patch("/contacts/:contactId", jsonParser, ctrlWrapper(patchContactController));
router.delete("/contacts/:contactId", ctrlWrapper(deleteContactController));


export default router;
