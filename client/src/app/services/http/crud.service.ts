import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpHeaderName } from '../../constants/http-header-name.enum';
import { HttpHeaderValue } from '../../constants/http-header-value.enum';
import { throwError } from 'rxjs';
import { BackendError } from '../../models/backend-error.model';
import { EnvironmentService } from '../environment.service';
import { Injectable, Injector } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class CrudService {
    protected constructor(private httpClient: HttpClient,
                          private environmentService: EnvironmentService,
                          private logger: NGXLogger,
                          private injector: Injector,
                          private router: Router) {
    }

    public async get<G>(request: string): Promise<G | null> {
        let response = null;
        try {
            response = await this.httpClient
                .get<G>(request)
                .toPromise();
        } catch (error) {
            response = this.errorHandler('GET', error);
        }
        return response;
    }

    public async post(body): Promise<any> {
        let response = null;
        try {
            response = await this.httpClient
                .post('', body)
                .toPromise();
        } catch (error) {
            response = this.errorHandler('POST', error);
        }
        return response;
    }

    public getData<T>(restUrl: string, httpParameter: HttpParams = null) {
        return this.httpClient
            .get<T>(`${this.environmentService.getBackendServerUrl()}/${restUrl}`, {
                params: httpParameter,
                headers: this.getHttpHeaders()
            })
            .pipe(catchError(this.handleError));
    }

    public postData<T, R>(restUrl: string, data: R) {
        return this.httpClient
            .post<T>(`${this.environmentService.getBackendServerUrl()}/${restUrl}`, data, this.getHttpParameters())
            .pipe(catchError(this.handleError)).toPromise();
    }

    public putData<T>(restUrl: string, data: T) {
        return this.httpClient
            .put<T>(`${this.environmentService.getBackendServerUrl()}/${restUrl}`, data, this.getHttpParameters())
            .pipe(catchError(this.handleError)).toPromise();
    }

    public delete<T>(restUrl: string, id: string) {
        return this.httpClient
            .delete<T>(`${this.environmentService.getBackendServerUrl()}/${restUrl}/${id}`, this.getHttpParameters())
            .pipe(catchError(this.handleError)).toPromise();
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
        return throwError(backendError);
    };

    public errorHandler(
        method: string,
        error: HttpErrorResponse,
    ): Promise<never> {
        this.logger.error(`Error occurred during ${method}`, error);
        return Promise.reject(error);
    }
}
