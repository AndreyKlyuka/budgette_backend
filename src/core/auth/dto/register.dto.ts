import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { PasswordsMatchingDecorator } from '@decorators';
import { Auth } from '@constants';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(Auth.MIN_PASSWORD_LENGTH)
    password: string;

    @IsString()
    @MinLength(Auth.MIN_PASSWORD_LENGTH)
    @Validate(PasswordsMatchingDecorator)
    passwordRepeat: string;
}
