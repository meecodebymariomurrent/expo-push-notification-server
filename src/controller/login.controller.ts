import { controller, httpPost, interfaces } from 'inversify-express-utils';

@controller('/login')
export class LoginController implements interfaces.Controller {
    @httpPost('/')
    public login(): string {
        return 'Home sweet home';
    }
}
