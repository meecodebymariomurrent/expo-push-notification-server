import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class NotificationRequest {
    @IsNotEmpty()
    @IsString()
    message: string;
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsArray()
    subscriber: Array<string>;
}
