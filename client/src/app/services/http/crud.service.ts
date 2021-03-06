import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpHeaderName } from '../../constants/http-header-name.enum';
import { HttpHeaderValue } from '../../constants/http-header-value.enum';
import { lastValueFrom, throwError } from 'rxjs';
import { BackendError } from '../../models/backend-error.model';
import { EnvironmentService } from '../environment.service';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  protected constructor(private httpClient: HttpClient,
                        private environmentService: EnvironmentService,
                        private logger: NGXLogger) {
  }

  public getData<T>(restUrl: string, httpParameter = {}) {
    return this.httpClient
      .get<T>(`${this.environmentService.getBackendServerUrl()}/${restUrl}`, {
        params: httpParameter,
        headers: this.getHttpHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  public postData<T, R>(restUrl: string, data: R) {
    return lastValueFrom(this.httpClient
      .post<T>(`${this.environmentService.getBackendServerUrl()}/${restUrl}`, data, this.getHttpParameters())
      .pipe(catchError(this.handleError)));
  }

  public putData<T>(restUrl: string, data: T) {
    return lastValueFrom(this.httpClient
      .put<T>(`${this.environmentService.getBackendServerUrl()}/${restUrl}`, data, this.getHttpParameters())
      .pipe(catchError(this.handleError)));
  }

  public delete<T>(restUrl: string, id: string) {
    return lastValueFrom(this.httpClient
      .delete<T>(`${this.environmentService.getBackendServerUrl()}/${restUrl}/${id}`, this.getHttpParameters())
      .pipe(catchError(this.handleError)));
  }

  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders().set(HttpHeaderName.ContentType, HttpHeaderValue.ApplicationJSON);
  }

  private getHttpParameters() {
    return {
      headers: this.getHttpHeaders()
    };
  }

  private readonly handleError = (error: HttpErrorResponse) => {
    this.logger.error(`Web request resulted in an error`, error);
    const backendError = new BackendError(error.status, error.name, error.url);
    backendError.message = error.error && error.error.message ? error.error.message : error.message;
    backendError.error = error.error && error.error.error ? error.error.error : error.error;
    return throwError(() => backendError);
  };

  public errorHandler(
    method: string,
    error: HttpErrorResponse,
  ): Promise<never> {
    this.logger.error(`Error occurred during ${method}`, error);
    return Promise.reject(error);
  }
}
