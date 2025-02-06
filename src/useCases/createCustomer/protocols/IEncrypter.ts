interface IEncrypter {
    hash: (password: string) => string;
}

export { IEncrypter };
