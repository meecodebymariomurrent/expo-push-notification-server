import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscriber } from '../../models/subscriber.model';
import { SubscriberService } from '../../services/subscriber.service';
import { MessageSeverity } from '../../constants/primeng/message-severity.enum';
import { NGXLogger } from 'ngx-logger';
import { AppIdentifierService } from '../../services/app-identifier.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendError } from '../../models/backend-error.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePageComponent implements OnInit {

  public subscriber: Array<Subscriber> = new Array<Subscriber>();
  public aboutDialogVisible = false;

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

  public fetchData(): void {
    this.subscriberService.getAll()
      .then((response) => this.subscriber = response)
      .catch((error) => this.handleError(error));
  }

  public handleCloseDialog(): void {
    this.aboutDialogVisible = false;
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
