import { Container } from 'inversify';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { UserService } from '../services/user.service';
import { SessionService } from '../services/session.service';
import { SubscriberService } from '../services/subscriber.service';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { CategoryService } from '../services/category.service';

export class ContainerConfigLoader {
    public static load(): Container {
        const container = new Container();
        container.bind<AuthenticationService>(AuthenticationService.name).to(AuthenticationService).inSingletonScope();
        container.bind<DatabaseService>(DatabaseService.name).to(DatabaseService).inSingletonScope();
        container.bind<UserService>(UserService.name).to(UserService).inSingletonScope();
        container.bind<SessionService>(SessionService.name).to(SessionService).inSingletonScope();
        container.bind<SubscriberService>(SubscriberService.name).to(SubscriberService).inSingletonScope();
        container.bind<CategoryService>(CategoryService.name).to(CategoryService).inSingletonScope();
        container.bind<JwtMiddleware>(JwtMiddleware.name).to(JwtMiddleware);
        return container;
    }
}
