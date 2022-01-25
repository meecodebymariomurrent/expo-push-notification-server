import { Injectable } from '@angular/core';
import { CrudService } from './http/crud.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage/storage.service';
import { StorageKey } from './storage/storage.model';
import { NGXLogger } from 'ngx-logger';
import { ApiPath } from '../constants/api-path.enum';
import { LoginRequest } from '../models/request/login-request.model';
import { LoginResponse } from '../models/response/login-response.model';
import {  Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private token: string = '';
  private userId: string = '';

  public loggedIn = new Subject<boolean>();

  constructor(private http: HttpClient,
              private storage: StorageService,
              private crudService: CrudService,
              private logger: NGXLogger) {
    this.token = this.storage.read(StorageKey.AUTH_TOKEN) || '';
    this.userId = this.storage.read(StorageKey.USER_ID) || '';
  }

  public async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await this.crudService.postData<LoginResponse, LoginRequest>(ApiPath.Login, {
        username,
        password
      });
      this.userId = response.userId;
      this.token = response.token;
      this.storage.save(StorageKey.AUTH_TOKEN, this.token);
      this.storage.save(StorageKey.USER_ID, this.userId);
      this.loggedIn.next(true);
      return Promise.resolve(true);
    } catch (error) {
      this.logger.error('Error during login request', error);
      return Promise.reject(error);
    }
  }

  public getToken(): string {
    return this.token;
  }

  public getUserId(): string {
    return this.userId;
  }

  public logout() {
    this.token = '';
    this.storage.remove(StorageKey.AUTH_TOKEN);
    this.loggedIn.next(false);
  }

  public isLogged(): boolean {
    return this.token.length > 0;
  }
}
