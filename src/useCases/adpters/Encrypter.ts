import { IEncrypter } from "../protocols/IEncrypter";
import bcrypt from "bcryptjs";
class Encrypter implements IEncrypter {
    compare(password: string, passwordHashed: string): boolean {
        return bcrypt.compareSync(password, passwordHashed);
    }
    hash(password: string): string {
        return bcrypt.hashSync(password, 10);
    }
}

export { Encrypter };
