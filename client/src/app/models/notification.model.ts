export interface Notification {
  title: string;
  message: string,
  data?: NotificationData,
  subscriber: Array<string>
}
