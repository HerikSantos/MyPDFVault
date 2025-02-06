import { Customer } from "../database/entities/Customer";

interface ICustomerRepository {
    findByEmail: (email: string) => Promise<Customer | null>;
    add: (customer: Customer) => Promise<void>;
}

export { ICustomerRepository };
