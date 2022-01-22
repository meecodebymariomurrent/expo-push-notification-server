import { Injectable } from '@angular/core';
import { ApiPath } from '../constants/api-path.enum';
import { CrudService } from './http/crud.service';
import { NGXLogger } from 'ngx-logger';
import { lastValueFrom } from 'rxjs';
import { Subscriber } from '../models/subscriber.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriberService {
  constructor(private crudService: CrudService, private logger: NGXLogger, private authenticationService: AuthenticationService) {

  }

  public getAll(): Promise<Array<Subscriber>> {
    try {
      const requestPath = ApiPath.Subscriber.replace('${id}', this.authenticationService.getUserId());
      return lastValueFrom(this.crudService.getData<Array<Subscriber>>(requestPath));
    } catch (error) {
      this.logger.error('Error while fetching all subscriber', error);
      return Promise.reject(error);
    }
  }
}
