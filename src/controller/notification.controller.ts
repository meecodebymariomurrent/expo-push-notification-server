import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { SubscriberService } from '../services/subscriber.service';
import { Subscriber } from '../models/subscriber.model';
import { StatusCodes } from 'http-status-codes';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { UserService } from '../services/user.service';
import { JwtMiddleware } from '../middleware/jwt.middleware';


@controller('/notification', JwtMiddleware.name)
export class NotificationController implements interfaces.Controller {
    private expoClient: Expo = new Expo();

    constructor(@inject(SubscriberService.name) private subscriberService: SubscriberService,
                @inject(UserService.name) private userService: UserService) {
    }

    @httpPost('/publish')
    public async publish(request: Request, response: Response): Promise<void> {
        try {
            const subscriber = await this.subscriberService.getAll();
            const messages = new Array<ExpoPushMessage>();
            subscriber.forEach((subscriber: Subscriber) => {
                if (!Expo.isExpoPushToken(subscriber.token)) {
                    return console.error(`Push token ${subscriber.token} is not a valid Expo push token`);
                }

                messages.push({
                    to: subscriber.token,
                    sound: 'default',
                    title: request.body.title,
                    body: request.body.message,
                });

            });
            const receipt = await this.expoClient.sendPushNotificationsAsync(messages);
            response.json({message: receipt});
            response.sendStatus(StatusCodes.OK)
        } catch (error) {

        }
    }
}
