import { Customer } from "../../database/entities/Customer";

interface tokenCustomer {
    customer: Pick<Customer, "name" | "email">;
    token: string;
}

interface ILoginCustomerUseCase {
    execute: (data: any) => Promise<tokenCustomer>;
}

export { ILoginCustomerUseCase, tokenCustomer };
