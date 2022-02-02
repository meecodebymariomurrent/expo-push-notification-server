import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import { BaseMiddleware } from 'inversify-express-utils';
import { injectable } from 'inversify';
import logger from '../utils/logger';

@injectable()
export class JwtMiddleware extends BaseMiddleware {
    public handler(request: Request, response: Response, next: NextFunction): void {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            try {
                const token = authHeader.split(' ')[1];
                verifyAccessToken(token).then(() => {
                    next();
                }).catch((error) => {
                    return response.status(StatusCodes.UNAUTHORIZED).json(error);
                });
            } catch (error) {
                logger.error(error);
                response.sendStatus(StatusCodes.UNAUTHORIZED);
            }
        } else {
            response.sendStatus(StatusCodes.UNAUTHORIZED);
        }
    }
}
