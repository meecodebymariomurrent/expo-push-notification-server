import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

const jwtMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        verifyAccessToken(token).then(() => {
            next();
        }).catch((error) => {
            return response.json(error).sendStatus(403);
        });
    } else {
        response.sendStatus(401);
    }
}

export { jwtMiddleware };
