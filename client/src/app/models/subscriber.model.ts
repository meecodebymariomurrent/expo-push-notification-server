export interface Subscriber {
  token: string;
  lastUpdate: Date;
  expired: boolean;
  appIdentifier: string;
  userId: string;
}
