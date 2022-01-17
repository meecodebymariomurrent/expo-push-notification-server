import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestModel {
    @IsNotEmpty()
    @IsString()
    username: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}
