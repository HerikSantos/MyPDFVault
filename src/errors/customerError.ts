class InvalidData extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, InvalidData.prototype);
    }
}

class InvalidType extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, InvalidType.prototype);
    }
}

class InvalidCredentialsError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    }
}

class UserNotFoundError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
    }
}

class EnvironmentError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, EnvironmentError.prototype);
    }
}

export {
    InvalidData,
    InvalidType,
    InvalidCredentialsError,
    UserNotFoundError,
    EnvironmentError,
};
