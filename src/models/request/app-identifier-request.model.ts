import { IsNotEmpty, IsString } from 'class-validator';

export class AppIdentifierRequest {
    @IsNotEmpty()
    @IsString()
    name: string;
}
