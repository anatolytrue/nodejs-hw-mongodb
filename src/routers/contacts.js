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
    validateBody(createContactSchema),
    ctrlWrapper(createContactsController)
);
router.patch(
    "/:contactId",
    isValidId,
    jsonParser,
    validateBody(updateContactSchema),
    ctrlWrapper(patchContactController)
);
router.delete(
    "/:contactId",
    isValidId,
    ctrlWrapper(deleteContactController)
);

export default router;
