import { inject, injectable } from 'inversify';
import { DatabaseTable } from '../constants/database-table.enum';
import { DatabaseService } from './database.service';
import { Subscriber } from '../models/subscriber.model';
import { SubscriberRequest } from '../models/request/subscriber-request.model';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';
import { ExistingEntity } from '../models/existingEntity.model';

@injectable()
export class SubscriberService {
    private readonly databaseTable = DatabaseTable.Subscriber;

    constructor(@inject(DatabaseService.name) private databaseService: DatabaseService) {
    }

    public getAll(userId: string): Promise<Array<Subscriber>> {
        return this.databaseService.filterBy<Subscriber>({userId: userId}, this.databaseTable);
    }

    public get(ids: Array<string>, property = 'id'): Promise<Array<Subscriber>> {
        return this.databaseService.filterByIds<Subscriber>(ids, property, this.databaseTable);
    }

    public async isRegistered(subscriber: SubscriberRequest): Promise<ExistingEntity<Subscriber>> {
        try {
            const subscriberExists = await this.subscriberExists(subscriber.token);
            return Promise.resolve(subscriberExists);
        } catch (error) {
            return Promise.reject('Error while checking if the subscriber already exists');
        }
    }

    public async create(subscriber: SubscriberRequest): Promise<Subscriber> {
        const subscriberExists = await this.subscriberExists(subscriber.token);
        if (subscriberExists.exists) {
            return Promise.reject(new DatabaseCreationError('A subscriber with the given token already exists'));
        }
        return new Promise((resolve, reject) => {
            this.databaseService.add<Subscriber>(this.mapSubscriber(subscriber), this.databaseTable)
                .then((response: Subscriber) => {
                    resolve(response);
                }).catch((error) => {
                reject(new DatabaseCreationError('Error while creating a subscriber', error));
            });
        });
    }

    public update(subscriber: SubscriberRequest, subscriberId: string): Promise<Subscriber> {
        return new Promise<Subscriber>((resolve, reject) => {
            this.databaseService.update<Subscriber>(subscriberId, this.mapSubscriber(subscriber), this.databaseTable)
                .then((response: Subscriber) => {
                    resolve(response);
                }).catch((error) => {
                reject(new DatabaseCreationError('Error while creating a subscriber', error));
            });
        });
    }

    private subscriberExists(token: string): Promise<ExistingEntity<Subscriber>> {
        return new Promise<ExistingEntity<Subscriber>>((resolve, reject) => {
            this.databaseService.filterBy<Subscriber>({token: token}, this.databaseTable).then((result: Array<Subscriber>) => {
                if (result.length > 0) {
                    resolve(new ExistingEntity(true, result[0]));
                } else {
                    resolve(new ExistingEntity(false));
                }
            }).catch(reject);
        });
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
