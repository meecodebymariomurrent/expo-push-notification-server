import { Injectable } from '@angular/core';
import { ApiPath } from '../constants/api-path.enum';
import { CrudService } from './http/crud.service';
import { NGXLogger } from 'ngx-logger';
import { lastValueFrom } from 'rxjs';
import { AppIdentifierResponse } from '../models/response/app-identifier-response.model';
import { AppIdentifierRequest } from '../models/request/app-identifier-request.model';
import { AppIdentifier } from '../models/app-identifier.model';
import { AuthenticationService } from './authentication.service';
import { Message, MessageService } from 'primeng/api';
import { MessageSeverity } from '../constants/primeng/message-severity.enum';

@Injectable({
  providedIn: 'root',
})
export class AppIdentifierService {
  constructor(private crudService: CrudService,
              private authenticationService: AuthenticationService,
              private messageService: MessageService,
              private logger: NGXLogger) {

  }

  public async getAll(): Promise<Array<AppIdentifier>> {
    try {
      const requestPath = ApiPath.AppIdentifier.replace('${id}', this.authenticationService.getUserId());
      return lastValueFrom(this.crudService.getData<Array<AppIdentifier>>(requestPath));
    } catch (error) {
      const message: Message = {
        severity: MessageSeverity.Error,
        summary: 'Error while fetching app identifier',
        data: error
      };
      this.messageService.add(message);
      this.logger.error('Error while fetching all app identifiers', error);
      return Promise.reject(error);
    }
  }

  public async create(appIdentifier: AppIdentifier): Promise<boolean> {
    try {
      const request = this.createAppIdentifierRequest(appIdentifier);
      await this.crudService.postData<AppIdentifierResponse, AppIdentifierRequest>(ApiPath.CreateAppIdentifier, request);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await this.crudService.delete(ApiPath.AppIdentifier, id);
      return Promise.resolve(true);
    } catch (error) {
      this.logger.error('Error while deleting app identifier', error);
      return Promise.reject(error);
    }
  }

  private createAppIdentifierRequest(appIdentifier: AppIdentifier): AppIdentifierRequest {
    return {
      name: appIdentifier.name,
      userId: this.authenticationService.getUserId()
    } as AppIdentifierRequest;
  }
}
