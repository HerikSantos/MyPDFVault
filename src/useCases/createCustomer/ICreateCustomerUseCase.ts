interface ICreateCustomerUseCase {
    execute: (data: any) => Promise<void>;
}

export { ICreateCustomerUseCase };
