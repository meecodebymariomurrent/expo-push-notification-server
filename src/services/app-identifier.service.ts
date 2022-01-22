import { inject, injectable } from 'inversify';
import { DatabaseTable } from '../constants/database-table.enum';
import { DatabaseService } from './database.service';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';
import { AppIdentifierRequest } from '../models/request/app-identifier-request.model';
import { AppIdentifier } from '../models/appIdentifier.model';

@injectable()
export class AppIdentifierService {
    private readonly databaseTable = DatabaseTable.AppIdentifier;

    constructor(@inject(DatabaseService.name) private databaseService: DatabaseService) {
    }

    public getAll(userId: string): Promise<Array<AppIdentifier>> {
        return this.databaseService.filterBy<AppIdentifier>({userId: userId}, this.databaseTable);
    }

    public async create(appIdentifier: AppIdentifierRequest): Promise<AppIdentifier> {
        const appIdentifierExists = await this.appIdentifierExists(appIdentifier.name);
        if (appIdentifierExists) {
            return Promise.reject(new DatabaseCreationError('An app identifier with the given name already exists'));
        }
        return new Promise((resolve, reject) => {
            this.databaseService.add<AppIdentifier>(this.mapAppIdentifier(appIdentifier), this.databaseTable)
                .then((response: AppIdentifier) => {
                    resolve(response);
                }).catch((error) => {
                reject(new DatabaseCreationError('Error while creating an app identifier', error));
            });
        })
    }

    public deleteById(id: string): Promise<boolean> {
        return this.databaseService.deleteById(id, this.databaseTable);
    }

    private mapAppIdentifier(appIdentifier: AppIdentifierRequest): AppIdentifier {
        const appIdentifierModel = new AppIdentifier();
        appIdentifierModel.name = appIdentifier.name;
        appIdentifierModel.userId = appIdentifier.userId;
        return appIdentifierModel;
    }

    private appIdentifierExists(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.databaseService.filterBy<AppIdentifier>({name: name}, this.databaseTable).then((result: Array<AppIdentifier>) => {
                resolve(result.length > 0);
            }).catch(reject)
        });
    }
}
