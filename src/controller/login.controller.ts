import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { LoginRequestModel } from '../models/request/login-request.model';
import { StatusCodes } from 'http-status-codes'
import { ApiErrorModel } from '../models/api-error.model';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from 'inversify';
import { transformAndValidate } from 'class-transformer-validator';

@controller('/login')
export class LoginController implements interfaces.Controller {
    constructor(@inject(AuthenticationService.name) private authenticationService: AuthenticationService,) {
    }

    @httpPost('')
    public async login(request: Request, response: Response): Promise<void> {
        try {
            const loginData = await transformAndValidate<LoginRequestModel>(LoginRequestModel, request.body) as LoginRequestModel;
            const accessData = await this.authenticationService.login(loginData);
            response.status(StatusCodes.OK).send(accessData);
        } catch (error) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .json(new ApiErrorModel('Bad Request', StatusCodes.BAD_REQUEST, error));
        }
    }
}
