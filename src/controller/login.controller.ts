import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { LoginRequest } from '../models/request/login-request.model';
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../models/errors/api-error.model';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from 'inversify';
import { transformAndValidate } from 'class-transformer-validator';
import { LoginError } from '../models/errors/login-error.model';

@controller('/login')
export class LoginController implements interfaces.Controller {
    constructor(@inject(AuthenticationService.name) private authenticationService: AuthenticationService,) {
    }

    @httpPost('')
    public async login(request: Request, response: Response): Promise<void> {
        try {
            const loginData = await transformAndValidate<LoginRequest>(LoginRequest, request.body) as LoginRequest;
            const accessData = await this.authenticationService.login(loginData);
            response.status(StatusCodes.OK).send(accessData);
        } catch (error) {
            if (error instanceof LoginError) {
                response
                    .status(StatusCodes.CONFLICT)
                    .json(new ApiError(error.message, StatusCodes.CONFLICT, error));
            } else {
                response
                    .status(StatusCodes.BAD_REQUEST)
                    .json(new ApiError('Bad Request', StatusCodes.BAD_REQUEST, error));
            }
        }
    }
}
