import { IsNotEmpty, IsString } from 'class-validator';

export class UserRequestModel {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
