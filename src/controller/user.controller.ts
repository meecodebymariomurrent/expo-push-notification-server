import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { UserService } from '../services/user.service';
import { transformAndValidate } from 'class-transformer-validator';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../models/errors/api-error.model';
import { UserRequest } from '../models/request/user-request.model';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';

@controller('/user')
export class UserController implements interfaces.Controller {
    constructor(@inject(UserService.name) private userService: UserService) {
    }

    @httpPost('/create')
    public async create(request: Request, response: Response): Promise<void> {
        try {
            const userData = await transformAndValidate<UserRequest>(UserRequest, request.body) as UserRequest;
            await this.userService.create(userData);
            response.sendStatus(StatusCodes.OK);
        } catch (error) {
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
