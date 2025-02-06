import { Customer } from "../../database/entities/Customer";
import { InvalidData, InvalidType } from "../../errors/customerError";
import { ICustomerRepository } from "../../repository/ICustomerRepository";
import { CreateCustomerUseCase } from "./CreateCustomerUseCase";
import { ICreateCustomerUseCase } from "./ICreateCustomerUseCase";
import { IEmailValidator } from "./protocols/IEmailValidator";
import { IEncrypter } from "./protocols/IEncrypter";

interface ITypeSUT {
    customerRepositoryStub: ICustomerRepository;
    encrypterStub: IEncrypter;
    emailValidatorStub: IEmailValidator;
    sut: ICreateCustomerUseCase;
}

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
    }

    return new EncrypterStub();
}

let repository: Customer[] = [];

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
function makeSUT(): ITypeSUT {
    const customerRepositoryStub = makeCustomerRepositoryStub();
    const encrypterStub = makeEncrypterStub();
    const emailValidatorStub = makeEmailValidatorStub();
    const sut = new CreateCustomerUseCase(
        emailValidatorStub,
        encrypterStub,
        customerRepositoryStub,
    );

    return {
        sut,
        customerRepositoryStub,
        emailValidatorStub,
        encrypterStub,
    };
}

describe("Create customer", () => {
    beforeEach(() => {
        repository = [];
    });

    it("It should throw if the name is invalid", async () => {
        const customer = {
            name: "",
            email: "teste@gmail.com",
            password: "teste_123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidData("invalid name, email or password ", 400),
        );
    });

    it("It should throw if the email is invalid", async () => {
        const customer = {
            name: "teste da silva",
            email: "",
            password: "teste_123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidData("invalid name, email or password ", 400),
        );
    });

    it("It should throw if the password is invalid", async () => {
        const customer = {
            name: "teste da silva",
            email: "teste@gmail.com",
            password: "",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidData("invalid name, email or password ", 400),
        );
    });

    it("It should throw if the name isn't string", async () => {
        const customer = {
            name: 2,
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidType("Name must be a string", 400),
        );
    });

    it("It should throw if the email isn't string", async () => {
        const customer = {
            name: "teste da silva",
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
            name: "teste da silva",
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
            name: "teste da silva",
            email: "teste.com",
            password: "password123",
        };

        const { sut, emailValidatorStub } = makeSUT();

        const emailValidatorStubSpy = jest.spyOn(emailValidatorStub, "isEmail");

        await sut.execute(customer);

        expect(emailValidatorStubSpy).toHaveBeenCalledWith(customer.email);
    });

    it("It should throw if email isn't a valid email", async () => {
        const customer = {
            name: "teste da silva",
            email: "teste.com",
            password: "password123",
        };

        const { sut, emailValidatorStub } = makeSUT();

        jest.spyOn(emailValidatorStub, "isEmail").mockReturnValueOnce(false);

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidData("invalid email", 400),
        );
    });

    it("It should throw if the user already exists", async () => {
        const customer = {
            name: "teste da silva",
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut } = makeSUT();

        await sut.execute(customer);

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidData("The customer already exists", 400),
        );
    });

    it("It should throw if the password is shorter than 8 characters", async () => {
        const customer = {
            name: "teste da silva",
            email: "teste@gmail.com",
            password: "pass123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new InvalidData("Password must be at least 8 characters long", 400),
        );
    });

    it("Encrypter should be called with the correct paramater", async () => {
        const customer = {
            name: "teste da silva",
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, encrypterStub } = makeSUT();

        const encrypterStubSpy = jest.spyOn(encrypterStub, "hash");

        await sut.execute(customer);

        expect(encrypterStubSpy).toHaveBeenCalledWith(customer.password);
    });
});
