import { IEmailValidator } from "../protocols/IEmailValidator";
import validator from "validator";

class EmailValidator implements IEmailValidator {
    isEmail(email: string): boolean {
        return validator.isEmail(email);
    }
}

export { EmailValidator };
