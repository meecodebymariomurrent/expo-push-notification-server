import { Injectable } from '@angular/core';
import { ApiPath } from '../constants/api-path.enum';
import { CrudService } from './http/crud.service';
import { NGXLogger } from 'ngx-logger';
import { lastValueFrom } from 'rxjs';
import { Subscriber } from '../models/subscriber.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriberService {
  constructor(private crudService: CrudService, private logger: NGXLogger) {

  }

  public getAll(): Promise<Array<Subscriber>> {
    try {
      return lastValueFrom(this.crudService.getData<Array<Subscriber>>(ApiPath.Subscriber));
    } catch (error) {
      this.logger.error('Error while fetching all subscriber', error);
      return Promise.reject(error);
    }
  }
}
