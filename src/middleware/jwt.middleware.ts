import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import { BaseMiddleware } from "inversify-express-utils";
import { injectable } from 'inversify';

@injectable()
export class JwtMiddleware extends BaseMiddleware {
    public handler(request: Request, response: Response, next: NextFunction) {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            verifyAccessToken(token).then(() => {
                next();
            }).catch((error) => {
                return response.json(error).sendStatus(StatusCodes.UNAUTHORIZED);
            });
        } else {
            response.sendStatus(StatusCodes.UNAUTHORIZED);
        }
    }
}
