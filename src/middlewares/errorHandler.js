import { isHttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {

    if (isHttpError(err) === true) {
        return res
            .status(err.statusCode)
            .json({
                status: err.statusCode,
                message: err.message
            });
    }

    // if (err instanceof HttpError) {
    //     res.status(err.status).json({
    //         status: err.status,
    //         message: err.name,
    //         data: err
    //     });
    //     return;
    // };

    res.status(500).json({
        status: 500,
        message: "Something went wrong",
        data: err.message 
    });
};
