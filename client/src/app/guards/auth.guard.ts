import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    CanActivate,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Page } from '../constants/page.enum';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authenticationService: AuthenticationService,
                private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (this.authenticationService.isLogged()) {
            this.authenticationService.redirectUrl = null;
            return true;
        }
        this.authenticationService.redirectUrl = state.url;
        this.router.navigate([Page.Login]);
        return false;
    }
}
