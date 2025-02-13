import { NextFunction, Request, Response } from "express";
import {
    EnvironmentError,
    InvalidCredentialsError,
    InvalidData,
    InvalidType,
    UserNotFoundError,
} from "../errors/customerError";

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

    if (err instanceof InvalidCredentialsError) {
        response.status(err.statusCode).json({
            error_code: "INVALID_CREDENTIAL",
            error_description: err.message,
        });

        return;
    }

    if (err instanceof UserNotFoundError) {
        response.status(err.statusCode).json({
            error_code: "USER_NOT_FOUND",
            error_description: err.message,
        });

        return;
    }

    if (err instanceof EnvironmentError) {
        response.status(err.statusCode).json({
            error_code: "ENVIRONMENT_ERROR",
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
