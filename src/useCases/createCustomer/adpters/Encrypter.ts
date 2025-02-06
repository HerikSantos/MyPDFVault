import { IEncrypter } from "../protocols/IEncrypter";
import bcrypt from "bcryptjs";
class Encrypter implements IEncrypter {
    hash(password: string): string {
        return bcrypt.hashSync(password, 10);
    }
}

export { Encrypter };
