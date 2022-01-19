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

    public getAll(): Promise<Array<AppIdentifier>> {
        return this.databaseService.getAll<AppIdentifier>(this.databaseTable);
    }

    public create(appIdentifier: AppIdentifierRequest): Promise<AppIdentifier> {
        return new Promise((resolve, reject) => {
            this.databaseService.add<AppIdentifier>(this.mapAppIdentifier(appIdentifier), this.databaseTable)
                .then((response: AppIdentifier) => {
                    resolve(response);
                }).catch((error) => {
                reject(new DatabaseCreationError('Error while creating an app identifier', error));
            });
        })
    }

    private mapAppIdentifier(appIdentifier: AppIdentifierRequest): AppIdentifier {
        const appIdentifierModel = new AppIdentifier();
        appIdentifierModel.name = appIdentifier.name;
        return appIdentifierModel;
    }
}
