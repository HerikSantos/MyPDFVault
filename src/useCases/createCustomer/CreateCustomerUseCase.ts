import { InvalidData, InvalidType } from "../../errors/customerError";
import { ICustomerRepository } from "../../repository/ICustomerRepository";
import { ICreateCustomerUseCase } from "./ICreateCustomerUseCase";
import { IEmailValidator } from "../protocols/IEmailValidator";
import { IEncrypter } from "../protocols/IEncrypter";

class CreateCustomerUseCase implements ICreateCustomerUseCase {
    constructor(
        private readonly emailValidator: IEmailValidator,
        private readonly encrypter: IEncrypter,
        private readonly customerRepository: ICustomerRepository,
    ) {}

    async execute(data: any): Promise<void> {
        const { name, email, password } = data;

        if (!name || !email || !password) {
            throw new InvalidData("invalid name, email or password ", 400);
        }

        if (typeof name !== "string") {
            throw new InvalidType("Name must be a string", 400);
        }

        if (typeof email !== "string") {
            throw new InvalidType("Email must be a string", 400);
        }

        if (typeof password !== "string") {
            throw new InvalidType("Password must be a string", 400);
        }

        if (!this.emailValidator.isEmail(email)) {
            throw new InvalidData("invalid email", 400);
        }

        const customerExists = await this.customerRepository.findByEmail(email);

        if (customerExists) {
            throw new InvalidData("The customer already exists", 400);
        }

        if (password.length < 8) {
            throw new InvalidData(
                "Password must be at least 8 characters long",
                400,
            );
        }

        const hashedPassword = this.encrypter.hash(password);

        const customer = {
            name,
            email,
            password: hashedPassword,
        };
        await this.customerRepository.add(customer);
    }
}

export { CreateCustomerUseCase };
