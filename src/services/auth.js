import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { User } from "../db/models/user.js";
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken';

import { FIFTEEN_MINUTES, ONE_DAY, TEMPLATES_DIR } from "../constants/index.js";
import { Session } from "../db/models/session.js";
// import { SMTP } from "../constants/index.js";
import { env } from "../utils/env.js";
import { sendEmail } from "../utils/sendMail.js";

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

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

export const requestResetToken = async (email) => {
    console.log('requestResetToken called with email:', email);
    console.log('JWT_SECRET:', env('JWT_SECRET'));
    console.log('APP_DOMAIN:', env('APP_DOMAIN'));
    console.log('SMTP_FROM:', env('SMTP_FROM'));

    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, "User not found");
    }

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email
        },
        env('JWT_SECRET'),
        {
            expiresIn: '5m'
        }
    );

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html'
    );

    let templateSource;
    try {
        templateSource = (await fs.readFile(resetPasswordTemplatePath)).toString();
    } catch (err) {
        console.error('Template file error:', err);
        throw new Error('Template file not found or cannot be read');
    }

    const template = handlebars.compile(templateSource);
    const resetLink = `${env('APP_DOMAIN')}/auth/reset-password?token=${resetToken}`;
    const html = template({
        name: user.name,
        link: resetLink
    });
    console.log('Generated reset link:', resetLink);

    await sendEmail({
        from: env('SMTP_FROM'),
        to: email,
        subject: 'Reset your password',
        html
    });
};

export const validateResetToken = async ({ token }) => {
    if (!token) {
        throw createHttpError(400, "Token is required");
    }
    try {
        const decodedToken = jwt.verify(token, env('JWT_SECRET'));
        return decodedToken;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw createHttpError(401, "Token is expired or invalid.");
        } else {
            throw createHttpError(500, "Internal server error.");
        }
    }
};

export const resetPassword = async (payload) => {
    let entries;

    try {
        entries = jwt.verify(payload.token, env('JWT_SECRET'));
    } catch (err) {
        if (err instanceof Error) throw createHttpError(401, err.message);
        throw err;
    }

    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub
    });

    if (!user) {
        throw createHttpError(404, "User not found");
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await User.updateOne(
        { _id: user._id },
        {password: encryptedPassword}
    );
};
