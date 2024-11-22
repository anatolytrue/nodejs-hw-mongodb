import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";

import contactsRouter from "./routers/contacts.js";
import { env } from './utils/env.js';
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use(
        pinoHttp({
            transport: {
                target: 'pino-pretty'
            }
        })
    );

    app.use(contactsRouter);

    app.use("*", notFoundHandler);
    app.use(errorHandler);

    // app.use((_, res, next) => {
    //     res.status(404).json({
    //         status: 'error',
    //         code: 404,
    //         message: 'Not found',
    //         data: 'Not found',
    //     });
    // });

    return app;
};

// const PORT = process.env.PORT || 3000;
const app = setupServer();

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
