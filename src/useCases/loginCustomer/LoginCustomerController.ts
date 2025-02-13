import { Request, Response } from "express";
import { ILoginCustomerUseCase } from "./ILoginCustomerUseCase";

class LoginCustomerController {
    constructor(private readonly loginCustomerUseCase: ILoginCustomerUseCase) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const data = request.body;

        const tokenCustomer = await this.loginCustomerUseCase.execute(data);

        return response.status(200).json(tokenCustomer);
    }
}

export { LoginCustomerController };
