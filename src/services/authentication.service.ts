import { inject, injectable } from 'inversify';
import { generateAccessToken } from '../utils/jwt';
import { UserService } from './user.service';
import { SessionModel } from '../models/session.model';
import { SessionService } from './session.service';
import { SessionState } from '../constants/session-state.enum';
import { LoginResponseModel } from '../models/login-response.model';
import { LoginRequestModel } from '../models/request/login-request.model';
import { UserModel } from '../models/user.model';

@injectable()
export class AuthenticationService {

    constructor(@inject(UserService.name) private userService: UserService,
                @inject(SessionService.name) private sessionService: SessionService) {
    }

    /**
     * Login the user
     *
     * @param loginData the login data to use
     * @returns {Promise<LoginRequestModel>} A Promise that returns when the login was successful
     */
    public async login(loginData: LoginRequestModel): Promise<LoginResponseModel> {
        try {
            const loginResponse = {} as LoginResponseModel;
            const user: UserModel = await this.userService.getByUsername(loginData.username);
            if (user.password === loginData.password) {
                const token = await generateAccessToken(loginData.username);
                loginResponse.loggedIn = true;
                loginResponse.token = token;
                const session: SessionModel = this.sessionService.startSession(user.username, token);
                if (session.sessionState === SessionState.Active) {
                    return Promise.resolve(loginResponse);
                }
                return Promise.reject('No active session found');
            } else {
                return Promise.reject('Username or password do not match');
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
