import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { SubscriberService } from '../services/subscriber.service';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../models/errors/api-error.model';
import { SubscriberRequest } from '../models/request/subscriber-request.model';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';
import logger from '../utils/logger';

@controller('/subscriber')
export class SubscriberController implements interfaces.Controller {
    constructor(@inject(SubscriberService.name) private subscriberService: SubscriberService,) {
    }

    @httpGet('/')
    public async getAllSubscriber(request: Request, response: Response): Promise<void> {
        try {
            const subscriber = await this.subscriberService.getAll();
            response.json(subscriber);
        } catch (error) {
            logger.error('Error retrieving all subscriber', [error]);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
        }
    }

    @httpPost('/create')
    public async create(request: Request, response: Response): Promise<void> {
        try {
            const subscriberData = request.body as SubscriberRequest;
            const subscriber = await this.subscriberService.create(subscriberData);
            response.status(StatusCodes.OK).send(subscriber);
        } catch (error) {
            logger.error('Error while creating subscriber', [error]);
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
