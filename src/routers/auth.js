import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    registerUserSchema,
    loginUserSchema,
    requestResetEmailSchema,
    resetPasswordSchema
} from '../validation/auth.js';
import {
    registerUserController,
    loginUserController,
    logoutUserController,
    refreshSessionController,
    requestResetEmailController,
    resetPasswordController,
    validateResetTokenController
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

router.get(
    '/reset-password',
    ctrlWrapper(validateResetTokenController)
);

router.post(
    '/reset-pwd',
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPasswordController)
);



export default router;
