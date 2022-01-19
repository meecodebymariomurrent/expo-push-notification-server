import { Injectable } from '@angular/core';
import { ApiPath } from '../constants/api-path.enum';
import { CrudService } from './http/crud.service';
import { NGXLogger } from 'ngx-logger';
import { lastValueFrom } from 'rxjs';
import { AppIdentifierResponse } from '../models/response/app-identifier-response.model';
import { AppIdentifierRequest } from '../models/request/app-identifier-request.model';
import { AppIdentifier } from '../models/app-identifier.model';

@Injectable({
  providedIn: 'root',
})
export class AppIdentifierService {
  constructor(private crudService: CrudService, private logger: NGXLogger) {

  }

  public async getAll(): Promise<Array<AppIdentifier>> {
    try {
      return lastValueFrom(this.crudService.getData<Array<AppIdentifier>>(ApiPath.AppIdentifier));
    } catch (error) {
      this.logger.error('Error while fetching all app identifiers', error);
      return Promise.reject(error);
    }
  }

  public async create(name: string): Promise<boolean> {
    try {
      await this.crudService.postData<AppIdentifierResponse, AppIdentifierRequest>(ApiPath.CreateAppIdentifier, {
        name,
      });
      return Promise.resolve(true);
    } catch (error) {
      this.logger.error('Error while creating app identifier', error);
      return Promise.reject(error);
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await this.crudService.delete(ApiPath.DeleteAppIdentifier, id);
      return Promise.resolve(true);
    } catch (error) {
      this.logger.error('Error while deleting app identifier', error);
      return Promise.reject(error);
    }
  }
}
