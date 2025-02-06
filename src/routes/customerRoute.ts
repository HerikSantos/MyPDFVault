import Router from "express";
import { CreateCustomerUseCase } from "../useCases/createCustomer/CreateCustomerUseCase";
import { CreateCustomerController } from "../useCases/createCustomer/CreateCustomerController";
import { EmailValidator } from "../useCases/createCustomer/adpters/EmailValidator";
import { Encrypter } from "../useCases/createCustomer/adpters/Encrypter";
import { CustomerRepository } from "../repository/CustomerRepository";

const customerRoute = Router();

const emailValidator = new EmailValidator();
const encrypter = new Encrypter();
const customerRepository = new CustomerRepository();
const createCustomerUseCase = new CreateCustomerUseCase(
    emailValidator,
    encrypter,
    customerRepository,
);
const createCustomerController = new CreateCustomerController(
    createCustomerUseCase,
);

customerRoute.post("/customer", async (request, response) => {
    await createCustomerController.handle(request, response);
});

export { customerRoute };
