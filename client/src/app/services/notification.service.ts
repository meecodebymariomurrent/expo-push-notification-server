import { Injectable } from '@angular/core';
import { ApiPath } from '../constants/api-path.enum';
import { CrudService } from './http/crud.service';
import { NGXLogger } from 'ngx-logger';
import { Notification } from '../models/notification.model';
import { NotificationRequest } from '../models/request/notification-request.model';
import { AuthenticationService } from './authentication.service';
import { NotificationResponse } from '../models/response/notification-response.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private crudService: CrudService,
              private authenticationService: AuthenticationService,
              private logger: NGXLogger) {

  }

  public async publish(notification: Notification): Promise<boolean> {
    try {
      const request = this.createNotificationRequest(notification);
      await this.crudService.postData<NotificationResponse, NotificationRequest>(ApiPath.PublishNotification, request);
      return Promise.resolve(true);
    } catch (error) {
      this.logger.error('Error while publishing notifications', error);
      return Promise.reject(error);
    }
  }

  private createNotificationRequest(notification: Notification): NotificationRequest {
    return {
      message: notification.message,
      subscriber: notification.subscriber,
    } as NotificationRequest;
  }
}
