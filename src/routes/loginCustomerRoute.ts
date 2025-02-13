import Router from "express";
import { LoginCustomerController } from "../useCases/loginCustomer/LoginCustomerController";
import { LoginCustomerUseCase } from "../useCases/loginCustomer/LoginCustomerUseCase";
import { EmailValidator } from "../useCases/adpters/EmailValidator";
import { CustomerRepository } from "../repository/CustomerRepository";
import { Encrypter } from "../useCases/adpters/Encrypter";
import { AuthenticationToken } from "../useCases/adpters/AuthenticationToken";
const loginCustomerRoute = Router();

const authenticationToken = new AuthenticationToken();
const encrypter = new Encrypter();
const customerRepository = new CustomerRepository();
const emailValidator = new EmailValidator();
const loginCustomerUseCase = new LoginCustomerUseCase(
    emailValidator,
    customerRepository,
    encrypter,
    authenticationToken,
);
const loginCustomerController = new LoginCustomerController(
    loginCustomerUseCase,
);

loginCustomerRoute.post("/login", async (request, response) => {
    await loginCustomerController.handle(request, response);
});

export { loginCustomerRoute };
