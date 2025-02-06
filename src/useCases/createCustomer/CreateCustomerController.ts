import { Request, Response } from "express";
import { ICreateCustomerUseCase } from "./ICreateCustomerUseCase";

class CreateCustomerController {
    constructor(
        private readonly createCustomerUseCase: ICreateCustomerUseCase,
    ) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const data = request.body;

        await this.createCustomerUseCase.execute(data);

        return response.status(201).json();
    }
}

export { CreateCustomerController };
