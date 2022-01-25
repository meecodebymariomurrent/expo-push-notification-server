import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class NotificationScheduleRequest {
    @IsNotEmpty()
    @IsString()
    message: string;
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsArray()
    subscriber: Array<string>;
    @IsNotEmpty()
    @IsDate()
    scheduledDate: Date;
}
