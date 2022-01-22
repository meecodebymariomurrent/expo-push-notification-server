import { controller, httpDelete, httpGet, httpPost, interfaces, requestParam } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../models/errors/api-error.model';
import { inject } from 'inversify';
import logger from '../utils/logger';
import { AppIdentifierService } from '../services/app-identifier.service';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';
import { AppIdentifierRequest } from '../models/request/app-identifier-request.model';
import { transformAndValidate } from 'class-transformer-validator';
import { AppIdentifierResponse } from '../models/response/app-identifier-response.model';
import { DeleteResponse } from '../models/response/delete-response.model';

@controller('/appIdentifier', JwtMiddleware.name)
export class AppIdentifierController implements interfaces.Controller {
    constructor(@inject(AppIdentifierService.name) private appIdentifierService: AppIdentifierService,) {
    }

    @httpPost('/create')
    public async create(request: Request, response: Response): Promise<void> {
        try {
            const appIdentifierData = await transformAndValidate<AppIdentifierRequest>(AppIdentifierRequest, request.body) as AppIdentifierRequest;
            const appIdentifierResponse = await this.appIdentifierService.create(appIdentifierData) as AppIdentifierResponse;
            response.status(StatusCodes.CREATED).json(appIdentifierResponse);
        } catch (error) {
            logger.error('Error while creating app identifier', [error]);
            if (error instanceof DatabaseCreationError) {
                response.status(StatusCodes.CONFLICT)
                    .send(new ApiError(error.message, StatusCodes.CONFLICT, error));
            } else {
                response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
            }
        }
    }

    @httpDelete('/:id')
    public async deleteAppIdentifier(@requestParam('id') id: string,
                                     request: Request,
                                     response: Response): Promise<void> {
        try {
            await this.appIdentifierService.deleteById(id);
            response.json(new DeleteResponse());
        } catch (error) {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
        }
    }
}
