import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { UserService } from '../services/user.service';

@controller('/notification')
export class NotificationController implements interfaces.Controller {
    constructor(@inject(UserService.name) private userService: UserService,) {
    }

    @httpPost('/publish')
    public create(request: Request, response: Response): void {

    }
}
