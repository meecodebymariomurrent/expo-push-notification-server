import { NotificationData } from './notification-data.model';

export interface Notification {
  title: string;
  message: string,
  data?: NotificationData,
  subscriber: Array<string>
}
