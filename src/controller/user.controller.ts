import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { UserService } from '../services/user.service';
import { transformAndValidate } from 'class-transformer-validator';
import { StatusCodes } from 'http-status-codes';
import { ApiErrorModel } from '../models/api-error.model';
import { UserRequestModel } from '../models/request/user-request.model';

@controller('/user')
export class UserController implements interfaces.Controller {
    constructor(@inject(UserService.name) private userService: UserService) {
    }

    @httpPost('/create')
    public async create(request: Request, response: Response): Promise<void> {
        try {
            const userData = await transformAndValidate<UserRequestModel>(UserRequestModel, request.body) as UserRequestModel;
            await this.userService.create(userData);
            response.sendStatus(StatusCodes.OK);
        } catch (error) {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ApiErrorModel('Error while creating user', StatusCodes.INTERNAL_SERVER_ERROR, error));
        }
    }
}
