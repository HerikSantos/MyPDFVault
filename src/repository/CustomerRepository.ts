import { Repository } from "typeorm";
import { Customer } from "../database/entities/Customer";
import { ICustomerRepository } from "./ICustomerRepository";
import { appDataSource } from "../database";

class CustomerRepository implements ICustomerRepository {
    private readonly repository: Repository<Customer>;

    constructor() {
        this.repository = appDataSource.getRepository(Customer);
    }

    async add(customer: Customer): Promise<void> {
        const createdCustomer = this.repository.create(customer);

        await this.repository.save(createdCustomer);
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const customer = await this.repository.findOneBy({ email });

        return customer;
    }
}

export { CustomerRepository };
