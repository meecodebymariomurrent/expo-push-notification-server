import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { NotificationRequestData } from './notification-request-data.model';

export class NotificationRequest {
    @IsNotEmpty()
    @IsString()
    message: string;
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsArray()
    subscriber: Array<string>;
    data?: NotificationRequestData;
}
