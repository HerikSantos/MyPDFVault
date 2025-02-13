import {
    IAuthenticationToken,
    verifyReturn,
} from "../protocols/IAuthenticationToken";
import jwt from "jsonwebtoken";

class AuthenticationToken implements IAuthenticationToken {
    sign(payload: string | object, secret: string): string {
        return jwt.sign(payload, secret, { expiresIn: "7D" });
    }
    verify(token: string, secret: string): verifyReturn {
        return jwt.verify(token, secret) as verifyReturn;
    }
}

export { AuthenticationToken };
