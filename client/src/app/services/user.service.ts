import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/response/login-response.model';
import { LoginRequest } from '../models/request/login-request.model';
import { ApiPath } from '../constants/api-path.enum';
import { CrudService } from './http/crud.service';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private crudService: CrudService, private logger: NGXLogger) {

  }

  public async create(username: string, password: string): Promise<boolean> {
    try {
      await this.crudService.postData<LoginResponse, LoginRequest>(ApiPath.Login, {
        username,
        password
      });
      return Promise.resolve(true);
    } catch (error) {
      this.logger.error('Error during login request', error);
      return Promise.reject(error);
    }
  }
}
