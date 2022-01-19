import { controller, httpPost, interfaces } from 'inversify-express-utils';
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

@controller('/user')
export class UserController implements interfaces.Controller {
    constructor(@inject(UserService.name) private userService: UserService) {
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