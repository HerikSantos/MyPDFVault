interface IEncrypter {
    hash: (password: string) => string;
    compare: (password: string, hashPassword: string) => boolean;
}

export { IEncrypter };
