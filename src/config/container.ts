import { Container } from 'inversify';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { UserService } from '../services/user.service';

export class ContainerConfigLoader {
    public static load(): Container {
        const container = new Container();
        container.bind<AuthenticationService>(AuthenticationService.name).to(AuthenticationService).inSingletonScope();
        container.bind<DatabaseService>(DatabaseService.name).to(DatabaseService).inSingletonScope();
        container.bind<UserService>(UserService.name).to(UserService).inSingletonScope();
        return container;
    }
}
