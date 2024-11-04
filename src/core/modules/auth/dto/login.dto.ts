import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Auth } from '@constants';

export class LoginDto {
  @IsNotEmpty({ message: 'Enter the email field with not empty value' })
  @IsString({ message: 'Email should be a string value' })
  @IsEmail({}, { message: 'Enter the email' })
  email: string;

  @IsNotEmpty({ message: 'Enter the password field with not empty value' })
  @IsString({ message: 'Password should be a string value' })
  @MinLength(Auth.MIN_PASSWORD_LENGTH, {
    message: 'Password is too short. Minimum length is $constraint1 characters.',
  })
  password: string;
}
