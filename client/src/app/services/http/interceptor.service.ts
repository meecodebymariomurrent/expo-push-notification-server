import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        const token: string = this.authenticationService.getToken();

        if (token) {
            req = req.clone({
                setHeaders: {Authorization: `Bearer ${token}`},
            });
        }

        return next.handle(req).pipe(tap(() => {
            },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status !== 401) {
                        return;
                    }
                    this.router.navigate(['login']);
                }
            }));
    }
}
