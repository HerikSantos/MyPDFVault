import {
    EnvironmentError,
    InvalidCredentialsError,
    InvalidData,
    InvalidType,
} from "../../errors/customerError";
import { ILoginCustomerUseCase, tokenCustomer } from "./ILoginCustomerUseCase";
import { IEmailValidator } from "../protocols/IEmailValidator";
import { ICustomerRepository } from "../../repository/ICustomerRepository";
import { IEncrypter } from "../protocols/IEncrypter";
import { IAuthenticationToken } from "../protocols/IAuthenticationToken";
import { log } from "node:console";

class LoginCustomerUseCase implements ILoginCustomerUseCase {
    constructor(
        private readonly emailValidator: IEmailValidator,
        private readonly customerRepository: ICustomerRepository,
        private readonly encrypter: IEncrypter,
        private readonly authenticationToken: IAuthenticationToken,
    ) {}

    async execute(data: any): Promise<tokenCustomer> {
        const { email, password } = data;

        if (!email || !password) {
            throw new InvalidCredentialsError("invalid email or password", 400);
        }

        if (typeof email !== "string") {
            throw new InvalidType("Email must be a string", 400);
        }

        if (typeof password !== "string") {
            throw new InvalidType("Password must be a string", 400);
        }

        if (!this.emailValidator.isEmail(email)) {
            throw new InvalidCredentialsError("invalid email", 400);
        }

        const customerExists = await this.customerRepository.findByEmail(email);

        if (!customerExists) {
            throw new InvalidCredentialsError(
                "invalid email or password ",
                400,
            );
        }

        const {
            name,
            email: customerEmail,
            password: hashPassword,
        } = customerExists;

        const isValidPassword = this.encrypter.compare(password, hashPassword);

        if (!isValidPassword) {
            throw new InvalidCredentialsError(
                "invalid email or password ",
                400,
            );
        }

        if (!process.env.JWT_SECRET) {
            throw new EnvironmentError(
                "Missing secret environment variable",
                503,
            );
        }

        const token = this.authenticationToken.sign(
            {
                customer: {
                    name,
                    email: customerEmail,
                },
            },
            process.env.JWT_SECRET,
        );

        return {
            customer: {
                name,
                email: customerEmail,
            },
            token,
        };
    }
}

export { LoginCustomerUseCase };
