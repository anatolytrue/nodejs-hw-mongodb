import { registerUser, loginUser, logoutUser, refreshUserSession } from "../services/auth.js";
import { ONE_DAY } from "../constants/index.js";
import { requestResetToken } from "../validation/auth.js";

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY)
    });

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY)
    });
};

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: user
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        deta: {
            accessToken: session.accessToken
        }
    });
};

export const logoutUserController = async(req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
};

export const refreshSessionController = async (req, res) => {
    const session = await refreshUserSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken
    });

    setupSession(res, session);

    res.json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: session.accessToken
        }
    });
};

export const requestResetEmailController = async (req, res) => {
    await requestResetToken(req.body.email);
    res.status(200).json({
        message: 'Reset password email was successfully sent!',
        status: 200,
        data: {}
    });
};
