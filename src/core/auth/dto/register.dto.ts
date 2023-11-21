import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { PasswordsMatchingDecorator } from '@decorators';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(7)
    password: string;

    @IsString()
    @MinLength(7)
    @Validate(PasswordsMatchingDecorator)
    passwordRepeat: string;
}
