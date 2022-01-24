import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { SubscriberService } from '../services/subscriber.service';
import { Subscriber } from '../models/subscriber.model';
import { StatusCodes } from 'http-status-codes';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { UserService } from '../services/user.service';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { transformAndValidate } from 'class-transformer-validator';
import { NotificationRequest } from '../models/request/notification-request.model';
import logger from '../utils/logger';
import { ApiError } from '../models/errors/api-error.model';
import { NotificationResponse } from '../models/response/notification-response.model';

@controller('/notification', JwtMiddleware.name)
export class NotificationController implements interfaces.Controller {
    private expoClient: Expo = new Expo();

    constructor(@inject(SubscriberService.name) private subscriberService: SubscriberService,
                @inject(UserService.name) private userService: UserService) {
    }

    @httpPost('/publish')
    public async publish(request: Request, response: Response): Promise<void> {
        try {
            const notificationData = await transformAndValidate<NotificationRequest>(NotificationRequest, request.body) as NotificationRequest;
            const subscriber = await this.subscriberService.get(notificationData.subscriber, 'token');
            const messages = new Array<ExpoPushMessage>();
            subscriber.forEach((subscriber: Subscriber) => {
                if (!Expo.isExpoPushToken(subscriber.token)) {
                    return console.error(`Push token ${subscriber.token} is not a valid Expo push token`);
                }

                messages.push({
                    to: subscriber.token,
                    sound: 'default',
                    title: notificationData.title,
                    body: notificationData.message,
                });
            });
            const receipt = await this.expoClient.sendPushNotificationsAsync(messages);
            const responseData = {message: receipt} as NotificationResponse;
            response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            logger.error('Error while publishing notification', [error]);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
        }
    }

    @httpPost('/schedule')
    public async schedule(request: Request, response: Response): Promise<void> {

    }

    @httpGet('/scheduled')
    public async getScheduled(request: Request, response: Response): Promise<void> {

    }
}
