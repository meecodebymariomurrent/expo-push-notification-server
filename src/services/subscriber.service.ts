import { inject, injectable } from 'inversify';
import { DatabaseTable } from '../constants/database-table.enum';
import { DatabaseService } from './database.service';
import { Subscriber } from '../models/subscriber.model';
import { SubscriberRequest } from '../models/request/subscriber-request.model';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';

@injectable()
export class SubscriberService {
    private readonly databaseTable = DatabaseTable.Subscriber;

    constructor(@inject(DatabaseService.name) private databaseService: DatabaseService) {
    }

    public getAll(): Promise<Array<Subscriber>> {
        return this.databaseService.getAll<Subscriber>(this.databaseTable);
    }

    public create(subscriber: SubscriberRequest): Promise<Subscriber> {
        return new Promise((resolve, reject) => {
            this.databaseService.add<Subscriber>(this.mapSubscriber(subscriber), this.databaseTable)
                .then((response: Subscriber) => {
                    resolve(response);
                }).catch((error) => {
                reject(new DatabaseCreationError('Error while creating a subscriber', error));
            });
        })
    }

    private mapSubscriber(subscriber: SubscriberRequest): Subscriber {
        const subscriberModel = new Subscriber();
        subscriberModel.token = subscriber.token;
        subscriberModel.expired = false;
        subscriberModel.appIdentifierId = subscriber.appIdentifierId;
        subscriberModel.lastUpdate = new Date();
        return subscriberModel;
    }
}
