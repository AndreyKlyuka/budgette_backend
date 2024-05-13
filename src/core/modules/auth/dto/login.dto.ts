import { IsEmail, IsString, MinLength } from 'class-validator';
import { Auth } from '@constants';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(Auth.MIN_PASSWORD_LENGTH)
    password: string;
}
