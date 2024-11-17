import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";

import { getAllContacts, getContactById } from "./services/contacts.js";

import { env } from './utils/env.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(cors());

    app.use(
        pinoHttp({
            transport: {
                target: 'pino-pretty'
            }
        })
    );

    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            message: "Successfully found contacts!",
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        if (!contact) {
            res.status(404).json({
                message: 'Contact not found'
            });
            return;
        };

        res.status(200).json({
            message: `Successfully found contact with id ${contactId}!`,
            data: contact
        });
    });

    app.use((req, res, next) => {
        res.status(404).json({
            status: 'error',
            code: 404,
            message: 'Not found',
            data: 'Not found',
        });
    });

    return app;
};

// const PORT = process.env.PORT || 3000;
const app = setupServer();

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
