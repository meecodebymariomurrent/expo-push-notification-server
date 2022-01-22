import { controller, httpGet, httpPost, interfaces, requestParam } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { UserService } from '../services/user.service';
import { transformAndValidate } from 'class-transformer-validator';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../models/errors/api-error.model';
import { UserRequest } from '../models/request/user-request.model';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';
import logger from '../utils/logger';
import { UserResponse } from '../models/response/user-response.model';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { SubscriberResponse } from '../models/response/subscriber-response.model';
import { SubscriberService } from '../services/subscriber.service';
import { AppIdentifierService } from '../services/app-identifier.service';

@controller('/user')
export class UserController implements interfaces.Controller {
    constructor(@inject(UserService.name) private userService: UserService,
                @inject(AppIdentifierService.name) private appIdentifierService: AppIdentifierService,
                @inject(SubscriberService.name) private subscriberService: SubscriberService) {
    }

    @httpGet('/:id/appIdentifier')
    public async getAll(@requestParam('id') id: string,
                        request: Request,
                        response: Response): Promise<void> {
        try {
            const appIdentifier = await this.appIdentifierService.getAll(id);
            response.json(appIdentifier);
        } catch (error) {
            logger.error('Error retrieving all app identifier', [error]);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
        }
    }

    @httpGet('/:id/subscriber', JwtMiddleware.name)
    public async getAllSubscriber(@requestParam('id') id: string,
                                  request: Request,
                                  response: Response): Promise<void> {
        try {
            const appIdentifier = await this.appIdentifierService.getAll(id);
            const ids = appIdentifier.map(a => a.id);
            const subscriber = await this.subscriberService.get(ids, 'appIdentifierId') as Array<SubscriberResponse>;
            response.status(StatusCodes.OK).json(subscriber);
        } catch (error) {
            logger.error('Error retrieving all subscriber', [error]);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
        }
    }

    @httpPost('/create')
    public async create(request: Request, response: Response): Promise<void> {
        try {
            const userData = await transformAndValidate<UserRequest>(UserRequest, request.body) as UserRequest;
            const userResponse = await this.userService.create(userData) as UserResponse;
            response.status(StatusCodes.OK).json(userResponse);
        } catch (error) {
            logger.error('Error while creating user', [error]);
            if (error instanceof DatabaseCreationError) {
                response.status(StatusCodes.CONFLICT)
                    .send(new ApiError(error.message, StatusCodes.CONFLICT, error));
            } else {
                response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
            }
        }
    }
}
