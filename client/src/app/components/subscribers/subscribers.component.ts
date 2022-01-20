import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscriber } from '../../models/subscriber.model';
import { Notification } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';
import { Message, MessageService } from 'primeng/api';
import { MessageSeverity } from '../../constants/primeng/message-severity.enum';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})
export class SubscribersComponent implements OnInit {

  @Input() public subscribers: Array<Subscriber> = new Array<Subscriber>();
  @Output() public notificationsPublished :EventEmitter<void>= new EventEmitter<void>();

  public selectedSubscriber: Array<string> = new Array<string>();

  public notifySubscriberDialogVisible = false;
  public notification: Notification = {} as Notification;

  constructor(private notificationService: NotificationService,
              private messageService: MessageService,
              private logger: NGXLogger) {
  }

  ngOnInit(): void {
  }

  public expireSelectedSubscriber(): void {

  }

  public handleNotifySubscriber(): void {
    const currentNotification = {...this.notification};
    currentNotification.subscriber = this.selectedSubscriber;
    this.notificationService.publish(currentNotification)
      .then(() => {
      this.notificationsPublished.emit();
      this.closeDialog();
    }).catch((error) => {
      const message: Message = {severity: MessageSeverity.Error, summary: 'Error while publishing notifications'};
      this.messageService.add(message);
      this.logger.error('Error while publishing notifications', error);
    });
  }

  public closeDialog(): void {
    this.notifySubscriberDialogVisible = false;
  }
}
