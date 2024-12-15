import {Router, json} from "express";

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
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const jsonParser = json();
const router = Router();

router.use(authenticate);

router.get(
    '/',
    ctrlWrapper(getContactsController)
);
router.get(
    '/:contactId',
    isValidId,
    ctrlWrapper(getContactByIdController)
);
router.post(
    "/",
    jsonParser,
    upload.single('photo'),
    validateBody(createContactSchema),
    ctrlWrapper(createContactsController)
);
router.patch(
    "/:contactId",
    isValidId,
    jsonParser,
    upload.single('photo'),
    validateBody(updateContactSchema),
    ctrlWrapper(patchContactController)
);
router.delete(
    "/:contactId",
    isValidId,
    ctrlWrapper(deleteContactController)
);

export default router;
