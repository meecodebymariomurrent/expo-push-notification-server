import { IsNotEmpty, IsString } from 'class-validator';

export class SubscriberRequest {
    @IsNotEmpty()
    @IsString()
    token: string;
}
