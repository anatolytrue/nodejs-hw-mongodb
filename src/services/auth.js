import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { User } from "../db/models/user.js";
import createHttpError from "http-errors";

import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { Session } from "../db/models/session.js";

export const createSessionTokens = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY)
    };
};

export const registerUser = async (payload) => {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) throw createHttpError(409, "Email in use");

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await User.create({
        ...payload,
        password: encryptedPassword
    });
};

export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(404, "User not found");
    }
    const isPasswordEqual = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordEqual) {
        throw createHttpError(401, "Unauthorized");
    }

    await Session.deleteOne({ userId: user._id });

    const newSession = createSessionTokens();
    return await Session.create({
        userId: user._id,
        ...newSession
    });
};

export const logoutUser = async (sessionId) => {
    await Session.deleteOne({ _id: sessionId });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken
    });
    if (!session) {
        throw createHttpError(401, "Session not found");
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) {
        throw createHttpError(401, "Session token expired");
    }

    const newSession = createSessionTokens();

    await Session.deleteOne({ _id: sessionId, refreshToken });

    return await Session.create({
        userId: session.userId,
        ...newSession
    });
};
