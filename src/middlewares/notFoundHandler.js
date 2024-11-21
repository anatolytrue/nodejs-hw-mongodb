import createError from "http-errors";


export const notFoundHandler = (_, res, next) => {
    next(createError(404, "Route not found"));
};
