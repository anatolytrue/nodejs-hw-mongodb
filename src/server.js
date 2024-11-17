import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";

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

    app.use((req, res, next) => {
        res.status(404).json({
            status: 'error',
            code: 404,
            message: 'Not found',
            data: 'Not found',
        });
    });

    return app;
}

// const PORT = process.env.PORT || 3000;
const app = setupServer();

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
