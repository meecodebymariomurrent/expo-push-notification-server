export enum ApiPath{
  Login = 'login',
  Register = 'user/create',
  Subscriber= 'user/${id}/subscriber',
  CreateSubscriber = 'subscriber/create',
  PublishNotification = 'notification/publish',
  AppIdentifier = 'user/${id}/appIdentifier',
  CreateAppIdentifier='appIdentifier/create',
}
