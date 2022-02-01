import { NotificationData } from '../notification-data.model';

export interface NotificationRequest {
  message: string,
  title: string,
  data: NotificationData;
  subscriber: Array<string>
}
