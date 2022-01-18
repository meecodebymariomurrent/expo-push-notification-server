import { inject, injectable } from 'inversify';
import { generateAccessToken } from '../utils/jwt';
import { UserService } from './user.service';
import { Session } from '../models/session.model';
import { SessionService } from './session.service';
import { SessionState } from '../constants/session-state.enum';
import { LoginResponse } from '../models/login-response.model';
import { LoginRequest } from '../models/request/login-request.model';
import { User } from '../models/user.model';
import { LoginError } from '../models/errors/login-error.model';

@injectable()
export class AuthenticationService {

    constructor(@inject(UserService.name) private userService: UserService,
                @inject(SessionService.name) private sessionService: SessionService) {
    }

    /**
     * Login the user
     *
     * @param loginData the login data to use
     * @returns {Promise<LoginRequest>} A Promise that returns when the login was successful
     */
    public async login(loginData: LoginRequest): Promise<LoginResponse> {
        try {
            const loginResponse = {} as LoginResponse;
            const user: User = await this.userService.getByUsername(loginData.username);
            if (user.password === loginData.password) {
                const token = await generateAccessToken(loginData.username);
                loginResponse.loggedIn = true;
                loginResponse.token = token;
                const session: Session = this.sessionService.startSession(user.username, token);
                if (session.sessionState === SessionState.Active) {
                    return Promise.resolve(loginResponse);
                }
                return Promise.reject(new LoginError('No active session found'));
            } else {
                return Promise.reject(new LoginError('Username or password do not match'));
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
