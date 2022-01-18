import { Injectable } from '@angular/core';
import { CrudService } from './http/crud.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage/storage.service';
import { StorageKey } from './storage/storage.model';
import { NGXLogger } from 'ngx-logger';
import { ApiPath } from '../constants/api-path.enum';
import { LoginRequest } from '../models/request/login-request.model';
import { LoginResponse } from '../models/response/login-response.model';
import { Page } from '../constants/page.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  token: string = '';
  redirectUrl: string | null = null;

  constructor(private http: HttpClient,
              private storage: StorageService,
              private crudService: CrudService,
              private logger: NGXLogger) {
    this.token = this.storage.read(StorageKey.AUTH_TOKEN) || '';
  }

  public async login(username: string, password: string): Promise<string> {
    try {
      const response = await this.crudService.postData<LoginResponse, LoginRequest>(ApiPath.Login, {
        username,
        password
      });
      this.token = response.token;
      this.storage.save(StorageKey.AUTH_TOKEN, this.token);
      return Promise.resolve(Page.Home);
    } catch (error) {
      this.logger.error('Error during login request', error);
      return Promise.reject(error);
    }
  }

  public getToken(): string {
    return this.token;
  }

  public logout() {
    this.token = '';
    this.storage.remove(StorageKey.AUTH_TOKEN);
  }

  public isLogged(): boolean {
    return this.token.length > 0;
  }
}
