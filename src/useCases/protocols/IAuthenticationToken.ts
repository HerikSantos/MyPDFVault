import { Customer } from "../../database/entities/Customer";

type verifyReturn = {
    customer: Pick<Customer, "name" | "email">;
    iat: number;
    exp: number;
};

interface IAuthenticationToken {
    verify: (token: string, secret: string) => verifyReturn;
    sign: (payload: string | object, secret: string) => string;
}

export { IAuthenticationToken, verifyReturn };
