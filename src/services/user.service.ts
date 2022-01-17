import { inject, injectable } from 'inversify';
import { DatabaseTable } from '../constants/database-table.enum';
import { DatabaseService } from './database.service';
import { UserModel } from '../models/user.model';

@injectable()
export class UserService {
    private readonly databaseTable = DatabaseTable.User;

    constructor(@inject(DatabaseService.name) private databaseService: DatabaseService) {
    }

    public getById(id: string): Promise<UserModel> {
        return this.databaseService.getById<UserModel>(id, this.databaseTable);
    }
}
