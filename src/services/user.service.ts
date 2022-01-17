import { inject, injectable } from 'inversify';
import { DatabaseTable } from '../constants/database-table.enum';
import { DatabaseService } from './database.service';
import { UserModel } from '../models/user.model';
import { UserRequestModel } from '../models/request/user-request.model';

@injectable()
export class UserService {
    private readonly databaseTable = DatabaseTable.User;

    constructor(@inject(DatabaseService.name) private databaseService: DatabaseService) {
    }

    public async getByUsername(username: string): Promise<UserModel> {
        try {
            const results: Array<UserModel> = await this.databaseService.filterBy<UserModel>({username: username}, this.databaseTable);
            return Promise.resolve(this.databaseService.getFirstEntry<UserModel>(results));
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async create(user: UserRequestModel): Promise<UserModel> {
        const userExists = await this.userExists(user.username);
        if (userExists) {
            return Promise.reject('Username already exists');
        }
        return new Promise((resolve, reject) => {
            this.databaseService.add<UserModel>(this.mapUser(user), this.databaseTable)
                .then((response: UserModel) => {
                    resolve(response);
                }).catch(reject);
        })
    }

    private userExists(username: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.databaseService.filterBy<UserModel>({username: username}, this.databaseTable).then((result: Array<UserModel>) => {
                resolve(result.length > 0);
            }).catch(reject)
        });
    }

    private mapUser(user: UserRequestModel): UserModel {
        const userModel = new UserModel();
        userModel.username = user.username;
        userModel.password = user.password;
        return userModel;
    }
}
