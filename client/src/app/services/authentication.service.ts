import { Injectable } from '@angular/core';
import { CrudService } from './http/crud.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage/storage.service';
import { StorageKey } from './storage/storage.model';
import { NGXLogger } from 'ngx-logger';

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

  public async login(email: string, password: string) {
    try {
      this.token = await this.crudService.post({email, password});
      this.storage.save(StorageKey.AUTH_TOKEN, this.token);
      return this.redirectUrl;
    } catch (error) {
      this.logger.error('Error during login request', error);
      return Promise.reject(error);
    }
  }

  public async mockLogin(email: string, password: string): Promise<any> {
    try {
      if (!(email === 'user' && password === 'user')) {
        throw new Error(
          'When using mockLogin, login with credentials: \nemail: users\npassword:users',
        );
      }
      this.token = 'user';
      this.storage.save(StorageKey.AUTH_TOKEN, this.token);
      return this.redirectUrl;
    } catch (e: any) {
      return Promise.reject(e.message);
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
