import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subscriber } from '../../models/subscriber.model';
import { Notification } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';
import { Message, MessageService } from 'primeng/api';
import { MessageSeverity } from '../../constants/primeng/message-severity.enum';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubscribersComponent implements OnInit {

  @Input() public subscribers: Array<Subscriber> = new Array<Subscriber>();
  @Output() public notificationsPublished: EventEmitter<void> = new EventEmitter<void>();

  public selectedSubscriber: Array<Subscriber> = new Array<Subscriber>();

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

  public publishNotification(): void {
    this.notifySubscriberDialogVisible = true;
  }

  public handleNotifySubscriber(): void {
    const currentNotification = {...this.notification};
    currentNotification.subscriber = this.selectedSubscriber.map(s => s.token);
    this.notificationService.publish(currentNotification)
      .then(() => {
        this.notificationsPublished.emit();
        this.closeDialog();
      }).catch((error) => {
      const message: Message = {severity: MessageSeverity.Error, summary: 'Error while publishing notifications'};
      this.messageService.add(message);
      this.logger.error('Error while publishing notifications', error);
      this.notification = {} as Notification;
    });
  }

  public closeDialog(): void {
    this.notifySubscriberDialogVisible = false;
    this.notification = {} as Notification;
  }
}
