import { Component, OnInit } from '@angular/core';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Page } from '../../constants/page.enum';
import { Subscriber } from '../../models/subscriber.model';
import { SubscriberService } from '../../services/subscriber.service';
import { MessageSeverity } from '../../constants/primeng/message-severity.enum';
import { NGXLogger } from 'ngx-logger';
import { AppIdentifierService } from '../../services/app-identifier.service';
import { AppIdentifier } from '../../models/app-identifier.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public subscriber: Array<Subscriber> = new Array<Subscriber>();
  public appIdentifier: Array<AppIdentifier> = new Array<AppIdentifier>();

  public items: Array<MenuItem> = [
    {
      label: 'Logout',
      icon: 'pi pi-fw pi-logout',
      command: () => {
        this.logout();
      }
    },
  ];

  constructor(private authenticationService: AuthenticationService,
              private subscriberService: SubscriberService,
              private appIdentifierService: AppIdentifierService,
              private messageService: MessageService,
              private logger: NGXLogger,
              private router: Router) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData(): void {
    this.subscriberService.getAll().then((response) => this.subscriber = response).catch((error) => this.handleError(error));
    this.appIdentifierService.getAll().then((response) => this.appIdentifier = response).catch((error) => this.handleError(error));
  }

  private logout(): void {
    this.authenticationService.logout();
    this.router.navigate([Page.Login]);
  }

  private handleError(error: any): void {
    const message: Message = {severity: MessageSeverity.Error, summary: 'while fetching data', data: error};
    this.messageService.add(message);
    this.logger.error('Failed to fetch data!', error);
  }
}
