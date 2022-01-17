import * as jwt from 'jsonwebtoken';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';

const generateAccessToken = (username: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: '1800s'}, (error, token) => {
            if (error) {
                reject(error)
            }
            resolve(token);
        });
    });
}

const verifyAccessToken = (token: string): Promise<JwtPayload> => {
    return new Promise<JwtPayload>((resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRET as string, (error: VerifyErrors, data: JwtPayload) => {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
}

export { generateAccessToken, verifyAccessToken };
