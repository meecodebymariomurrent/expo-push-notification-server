import { IsNotEmpty, IsString } from 'class-validator';

export class UserRequest {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
