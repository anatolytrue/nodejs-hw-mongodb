import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    registerUserSchema,
    loginUserSchema,
    requestResetEmailSchema
} from '../validation/auth.js';
import {
    registerUserController,
    loginUserController,
    logoutUserController,
    refreshSessionController,
    requestResetEmailController
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
    '/register',
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController)
);

router.post(
    '/login',
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController)
);

router.post(
    '/refresh',
    ctrlWrapper(refreshSessionController)
);

router.post(
    '/logout',
    ctrlWrapper(logoutUserController)
);

router.post(
    '/send-reset-email',
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController)
);

export default router;
