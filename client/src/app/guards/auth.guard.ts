import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    CanActivate,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { StorageService } from '../core/services/storage/storage.service';
import { StorageKey } from '../core/services/storage/storage.model';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '../core/constants/page.enum';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router,
                private storageService: StorageService,
                private translateService: TranslateService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const hasSelectedEvent = this.storageService.hasValue(StorageKey.SELECTED_EVENT);
        if (this.authService.isLogged() && hasSelectedEvent) {
            this.authService.redirectUrl = null;
            return true;
        }
        this.authService.redirectUrl = state.url;
        this.router.navigate([Page.Login]);
        return false;
    }
}
