import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthenticationService } from './services/authentication.service';
import { SubscriberService } from './services/subscriber.service';
import { AppIdentifierService } from './services/app-identifier.service';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { Page } from './constants/page.enum';
import { CrudService } from './services/http/crud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('100ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  public aboutDialogVisible = false;
  public menuVisible = true;
  public loggedIn = false;

  public items: Array<MenuItem> = [];

  constructor(private authenticationService: AuthenticationService,
              private subscriberService: SubscriberService,
              private appIdentifierService: AppIdentifierService,
              private messageService: MessageService,
              private translateService: TranslateService,
              private logger: NGXLogger,
              private crudService: CrudService,
              private router: Router) {
  }

  public async ngOnInit(): Promise<void> {
    await this.authenticationService.checkLoggedInStatus();
    this.loggedIn = this.authenticationService.isLogged();
    this.authenticationService.loggedIn.subscribe((value: boolean) => {
      this.loggedIn = value;
    });
    this.initMenuItems();
  }


  public handleCloseDialog(): void {
    this.aboutDialogVisible = false;
  }

  public toggleSideMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

  private logout(): void {
    this.authenticationService.logout();
    this.router.navigate([Page.Login]).catch(this.logger.error);
  }

  private showAboutInfo(): void {
    this.aboutDialogVisible = true;
  }

  private initMenuItems(): void {
    this.translateService.get('Home.Menu.Logout').subscribe(() => {
      this.items = [
        {
          label: this.translateService.instant('Home.Menu.Logout'),
          icon: 'pi pi-fw pi-sign-out',
          command: () => {
            this.logout();
          }
        },
        {
          label: this.translateService.instant('Home.Menu.About'),
          icon: 'pi pi-fw pi-info-circle',
          command: () => {
            this.showAboutInfo();
          }
        }]
    });
  }

}
