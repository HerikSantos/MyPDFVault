import { NextFunction, Request, Response } from "express";
import { InvalidData, InvalidType } from "../errors/customerError";

function errorPrevent(
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    console.log(err);

    if (err instanceof InvalidData) {
        response.status(err.statusCode).json({
            error_code: "INVALID_DATA",
            error_description: err.message,
        });

        return;
    }

    if (err instanceof InvalidType) {
        response.status(err.statusCode).json({
            error_code: "INVALID_TYPE",
            error_description: err.message,
        });

        return;
    }

    response.status(500).json({
        error_description: "Internal Server Error",
    });
}

export { errorPrevent };
