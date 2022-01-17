import { inject, injectable } from 'inversify';
import { DatabaseTable } from '../constants/database-table.enum';
import { DatabaseService } from './database.service';
import { SubscriberModel } from '../models/subscriber.model';
import { SubscriberRequestModel } from '../models/request/subscriber-request.model';

@injectable()
export class SubscriberService {
    private readonly databaseTable = DatabaseTable.Subscriber;

    constructor(@inject(DatabaseService.name) private databaseService: DatabaseService) {
    }

    public getAll(): Promise<Array<SubscriberModel>> {
        return this.databaseService.getAll<SubscriberModel>(this.databaseTable);
    }

    public create(subscriber: SubscriberRequestModel): Promise<SubscriberModel> {
        return new Promise((resolve, reject) => {
            this.databaseService.add<SubscriberModel>(this.mapSubscriber(subscriber), this.databaseTable)
                .then((response: SubscriberModel) => {
                    resolve(response);
                }).catch((error) => {
                reject(error);
            });
        })
    }

    private mapSubscriber(subscriber: SubscriberRequestModel): SubscriberModel {
        const subscriberModel = new SubscriberModel();
        subscriberModel.token = subscriber.token;
        subscriberModel.expired = false;
        subscriberModel.lastUpdate = new Date();
        return subscriberModel;
    }
}
