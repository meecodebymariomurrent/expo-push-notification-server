import { IsNotEmpty, IsString } from 'class-validator';

export class SubscriberRequestModel {
    @IsNotEmpty()
    @IsString()
    token: string;
}
