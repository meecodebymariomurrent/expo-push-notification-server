import { controller, httpGet, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'
import logger from '../utils/logger';
import { JwtMiddleware } from '../middleware/jwt.middleware';

let tainted = false;

@controller('/health', JwtMiddleware.name)
export class HealthController implements interfaces.Controller {

    @httpGet('/live')
    public async getAll(request: Request, response: Response): Promise<void> {
        if (tainted) {
            response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        } else {
            response.end()
        }
    }

}

process.on('uncaughtException', (err) => {
    logger.error('FATAL: Uncaught Exception: %s %s', err.message, err.stack);
    // An uncaught exception indicates a severe programming mistake;
    // The service might not work as expected anymore, so, flag it as tainted and request a restart
    tainted = true;
});
