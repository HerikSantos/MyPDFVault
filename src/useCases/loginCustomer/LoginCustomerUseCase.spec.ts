import { Customer } from "../../database/entities/Customer";
import "dotenv/config";

import {
    EnvironmentError,
    InvalidCredentialsError,
    InvalidData,
    InvalidType,
} from "../../errors/customerError";
import { ICustomerRepository } from "../../repository/ICustomerRepository";
import {
    IAuthenticationToken,
    verifyReturn,
} from "../protocols/IAuthenticationToken";
import { IEmailValidator } from "../protocols/IEmailValidator";
import { IEncrypter } from "../protocols/IEncrypter";
import { ILoginCustomerUseCase } from "./ILoginCustomerUseCase";
import { LoginCustomerUseCase } from "./LoginCustomerUseCase";

interface ITypeSUT {
    customerRepositoryStub: ICustomerRepository;
    encrypterStub: IEncrypter;
    emailValidatorStub: IEmailValidator;
    sut: ILoginCustomerUseCase;
}

let repository: Customer[];

function makeEmailValidatorStub() {
    class EmailValidatorStub implements IEmailValidator {
        isEmail(email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
}

function makeEncrypterStub() {
    class EncrypterStub implements IEncrypter {
        hash(password: string): string {
            return "hashed_password";
        }

        compare(password: string, hashPassword: string): boolean {
            return true;
        }
    }

    return new EncrypterStub();
}

function makeCustomerRepositoryStub(): ICustomerRepository {
    class CustomerRepositoryStub implements ICustomerRepository {
        async add(customer: Customer): Promise<void> {
            repository.push(customer);
        }
        async findByEmail(email: string): Promise<Customer | null> {
            const result = repository.find(
                (customer) => (customer.email = email),
            );

            if (!result) {
                return null;
            }

            return result;
        }
    }

    return new CustomerRepositoryStub();
}

function makeAuthenticationTokenStub(): IAuthenticationToken {
    class AuthenticationTokenStub implements IAuthenticationToken {
        sign(payload: string | object, secret: string): string {
            return "valid_token";
        }

        verify: (token: string, secret: string) => verifyReturn;
    }

    return new AuthenticationTokenStub();
}

function makeSUT(): ITypeSUT {
    const customerRepositoryStub = makeCustomerRepositoryStub();
    const encrypterStub = makeEncrypterStub();
    const emailValidatorStub = makeEmailValidatorStub();
    const authenticationTokenStub = makeAuthenticationTokenStub();
    const sut = new LoginCustomerUseCase(
        emailValidatorStub,
        customerRepositoryStub,
        encrypterStub,
        authenticationTokenStub,
    );

    return {
        sut,
        customerRepositoryStub,
        emailValidatorStub,
        encrypterStub,
    };
}

describe("Login Customer", () => {
    beforeEach(() => {
        repository = [];
    });

    it("It should throw if the password is invalid", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidCredentialsError("invalid email or password", 400),
        );
    });

    it("It should throw if the email is invalid", async () => {
        const customer = {
            email: "",
            password: "teste_123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidCredentialsError("invalid email or password", 400),
        );
    });

    it("It should throw if the email isn't string", async () => {
        const customer = {
            email: 1,
            password: "password123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidType("Email must be a string", 400),
        );
    });

    it("It should throw if the password isn't string", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: 12345678,
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidType("Password must be a string", 400),
        );
    });

    it("EmailValidator should be called with the correct parameter ", async () => {
        const customer = {
            email: "teste.com",
            password: "password123",
        };

        const { sut, emailValidatorStub } = makeSUT();

        const emailValidatorStubSpy = jest.spyOn(emailValidatorStub, "isEmail");

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidCredentialsError("invalid email or password ", 400),
        );
        expect(emailValidatorStubSpy).toHaveBeenCalledWith(customer.email);
    });

    it("It should throw if email isn't a valid email", async () => {
        const customer = {
            email: "teste.com",
            password: "password123",
        };

        const { sut, emailValidatorStub } = makeSUT();

        jest.spyOn(emailValidatorStub, "isEmail").mockReturnValueOnce(false);

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidCredentialsError("invalid email", 400),
        );
    });

    it("It should throw if the customer not exists", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidCredentialsError("invalid email or password ", 400),
        );
    });

    it("It should throw if the password is incorrect", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "pass123",
        };

        const { sut, encrypterStub } = makeSUT();

        jest.spyOn(encrypterStub, "compare").mockReturnValueOnce(false);

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidCredentialsError("invalid email or password ", 400),
        );
    });

    it("It should throw if the JWT SECRET environment is missing", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "pass123",
        };

        const { sut, customerRepositoryStub } = makeSUT();

        jest.spyOn(customerRepositoryStub, "findByEmail").mockResolvedValueOnce(
            {
                email: "validemail@gmail.com",
                name: "valid_name",
                password: "valid_password",
            },
        );

        process.env.JWT_SECRET = "";

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new EnvironmentError("Missing secret environment variable", 503),
        );
    });

    it("It should be possible login with correct params", async () => {
        const customer = {
            name: "valid_name",
            email: "teste@gmail.com",
            password: "pass123",
        };
        const { sut, customerRepositoryStub } = makeSUT();

        jest.spyOn(customerRepositoryStub, "findByEmail").mockResolvedValueOnce(
            {
                name: "valid_name",
                email: "teste@gmail.com",
                password: "hashed_password",
            },
        );

        process.env.JWT_SECRET = "valid_secret";

        await expect(sut.execute(customer)).resolves.toStrictEqual({
            customer: {
                name: customer.name,
                email: customer.email,
            },
            token: "valid_token",
        });
    });
});
