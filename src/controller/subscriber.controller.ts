import { controller, httpPost, interfaces, requestParam } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { SubscriberService } from '../services/subscriber.service';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../models/errors/api-error.model';
import { SubscriberRequest } from '../models/request/subscriber-request.model';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';
import logger from '../utils/logger';
import { SubscriberResponse } from '../models/response/subscriber-response.model';
import { ExistingEntity } from '../models/existingEntity.model';
import { Subscriber } from '../models/subscriber.model';

@controller('/subscriber')
export class SubscriberController implements interfaces.Controller {
    constructor(@inject(SubscriberService.name) private subscriberService: SubscriberService) {
    }

    @httpPost('/exists')
    public async isRegistered(request: Request, response: Response): Promise<void> {
        try {
            const subscriberData = request.body as SubscriberRequest;
            const subscriber = await this.subscriberService.isRegistered(subscriberData) as ExistingEntity<Subscriber>;
            response.status(StatusCodes.OK).json(subscriber);
        } catch (error) {
            logger.error('Error checking isRegistered status', [error]);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
        }
    }

    @httpPost('/create')
    public async create(request: Request, response: Response): Promise<void> {
        try {
            const subscriberData = request.body as SubscriberRequest;
            const subscriber = await this.subscriberService.create(subscriberData) as SubscriberResponse;
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

    @httpPost('/:id')
    public async updateSubscriber(@requestParam('id') id: string,
                                  request: Request,
                                  response: Response): Promise<void> {
        try {
            const subscriberData = request.body as SubscriberRequest;
            const subscriber = await this.subscriberService.update(subscriberData, id) as SubscriberResponse;
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
