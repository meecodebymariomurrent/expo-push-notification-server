import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { LoginModel } from '../models/login.model';
import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes'
import { ApiErrorModel } from '../models/api-error.model';
import { LoginResponseModel } from '../models/login-response.model';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from 'inversify';

@controller('/login')
export class LoginController implements interfaces.Controller {
    constructor(@inject(AuthenticationService.name) private authenticationService: AuthenticationService,) {
    }

    @httpPost('/')
    public login(request: Request, response: Response): void {
        const loginData = request.body as LoginModel;
        validate(loginData).then((errors: Array<ValidationError>) => {
            if (errors && errors.length > 0) {
                response
                    .status(StatusCodes.BAD_REQUEST)
                    .send(new ApiErrorModel('Bad Request', StatusCodes.BAD_REQUEST, errors));
            } else {
                this.authenticationService.login(loginData).then((accessData: LoginResponseModel) => {
                    response.status(StatusCodes.OK).send(accessData);
                }).catch(() => {
                    const error = new ApiErrorModel('Username or password incorrect', StatusCodes.UNAUTHORIZED);
                    response.status(StatusCodes.UNAUTHORIZED).send(error);
                });
            }
        });
    }
}
