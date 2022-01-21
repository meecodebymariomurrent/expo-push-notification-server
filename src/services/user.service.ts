import { inject, injectable } from 'inversify';
import { DatabaseTable } from '../constants/database-table.enum';
import { DatabaseService } from './database.service';
import { User } from '../models/user.model';
import { UserRequest } from '../models/request/user-request.model';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';

@injectable()
export class UserService {
    private readonly databaseTable = DatabaseTable.User;

    constructor(@inject(DatabaseService.name) private databaseService: DatabaseService) {
    }

    public async getByUsername(username: string): Promise<User> {
        try {
            const results: Array<User> = await this.databaseService.filterBy<User>({username: username}, this.databaseTable);
            return Promise.resolve(this.databaseService.getFirstEntry<User>(results));
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async create(user: UserRequest): Promise<User> {
        const userExists = await this.userExists(user.username);
        if (userExists) {
            return Promise.reject(new DatabaseCreationError('A user with the given username already exists'));
        }
        return new Promise((resolve, reject) => {
            this.databaseService.add<User>(this.mapUser(user), this.databaseTable)
                .then((response: User) => {
                    resolve(response);
                }).catch((error) => {
                reject(new DatabaseCreationError('Error while creating a user', error));
            });
        })
    }

    private userExists(username: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.databaseService.filterBy<User>({username: username}, this.databaseTable).then((result: Array<User>) => {
                resolve(result.length > 0);
            }).catch(reject);
        });
    }

    private mapUser(user: UserRequest): User {
        const userModel = new User();
        userModel.username = user.username;
        userModel.password = user.password;
        return userModel;
    }
}
