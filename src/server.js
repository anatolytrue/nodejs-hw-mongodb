import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import specs from '../swaggerConfig.js';
import router from "./routers/index.js";
import { env } from './utils/env.js';
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { UPLOAD_DIR } from "./constants/index.js";

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use(
        pinoHttp({
            transport: {
                target: 'pino-pretty'
            }
        })
    );
    app.use('/uploads', express.static(UPLOAD_DIR));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    
    app.use(router);

    app.use("*", notFoundHandler);
    app.use(errorHandler);

    return app;
};

const app = setupServer();

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
