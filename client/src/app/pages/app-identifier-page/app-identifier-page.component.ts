import { Component, OnInit } from '@angular/core';
import { AppIdentifier } from '../../models/app-identifier.model';
import { AuthenticationService } from '../../services/authentication.service';
import { SubscriberService } from '../../services/subscriber.service';
import { AppIdentifierService } from '../../services/app-identifier.service';
import { Message, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { MessageSeverity } from '../../constants/primeng/message-severity.enum';
import { BackendError } from '../../models/backend-error.model';

@Component({
  selector: 'app-app-identifier-page',
  templateUrl: './app-identifier-page.component.html',
  styleUrls: ['./app-identifier-page.component.scss']
})
export class AppIdentifierPageComponent implements OnInit {

  public appIdentifier: Array<AppIdentifier> = new Array<AppIdentifier>();

  constructor(private authenticationService: AuthenticationService,
              private subscriberService: SubscriberService,
              private appIdentifierService: AppIdentifierService,
              private messageService: MessageService,
              private translateService: TranslateService,
              private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  public handleDeleteAppIdentifier(appIdentifier: Array<AppIdentifier>): void {
    const deletePromises = new Array<Promise<boolean>>();
    appIdentifier.forEach((identifier: AppIdentifier) => {
      deletePromises.push(this.appIdentifierService.delete(identifier.id));
    });
    Promise.allSettled(deletePromises).then((results: Array<PromiseSettledResult<boolean>>) => {
      const rejected = results.filter(r => r.status === 'rejected');
      if (rejected.length > 0) {
        const message: Message = {severity: MessageSeverity.Error, summary: 'Error while deleting app identifier(s)'};
        this.messageService.add(message);
        this.logger.error('Error while deleting app identifiers');
      }
      this.fetchData();
    });
  }

  public handleAppIdentifierSaved(): void {
    this.fetchData();
  }

  public fetchData(): void {
    this.appIdentifierService.getAll()
      .then((response) => this.appIdentifier = response)
      .catch((error) => this.handleError(error));
  }

  private handleError(error: BackendError): void {
    const message: Message = {
      severity: MessageSeverity.Error,
      summary: 'Error while fetching data',
      data: error,
      detail: error.message
    };
    this.messageService.add(message);
    this.logger.error('Failed to fetch data!', error);
  }

}
