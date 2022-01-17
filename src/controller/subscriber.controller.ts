import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { SubscriberService } from '../services/subscriber.service';
import { StatusCodes } from 'http-status-codes';
import { ApiErrorModel } from '../models/api-error.model';
import { SubscriberModel } from '../models/subscriber.model';
import { SubscriberRequestModel } from '../models/request/subscriber-request.model';

@controller('/subscriber')
export class SubscriberController implements interfaces.Controller {
    constructor(@inject(SubscriberService.name) private subscriberService: SubscriberService,) {
    }

    @httpGet('/')
    public getSubscriber(request: Request, response: Response): void {
        this.subscriberService.getAll().then((data: Array<SubscriberModel>) => {
            response.json(data);
        }).catch(() => {
            response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }

    @httpPost('/create')
    public create(request: Request, response: Response): void {
        try {
            const subscriberData = request.body as SubscriberRequestModel;
            this.subscriberService.create(subscriberData).then((accessData: SubscriberModel) => {
                response.status(StatusCodes.OK).send(accessData);
            }).catch(() => {
                const error = new ApiErrorModel('Error while creating subscriber', StatusCodes.INTERNAL_SERVER_ERROR);
                response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            });
        } catch (error) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .json(new ApiErrorModel('Bad Request', StatusCodes.BAD_REQUEST, error));
        }
    }
}
