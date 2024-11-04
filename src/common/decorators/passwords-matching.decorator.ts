import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DecoratorConfig } from '@constants';
import { RegisterDto } from '@auth/dto';

@ValidatorConstraint({ name: DecoratorConfig.IS_PASSWORD_MATCHING_KEY, async: false })
export class PasswordsMatchingDecorator implements ValidatorConstraintInterface {
  validate(passwordRepeat: string, args: ValidationArguments): boolean {
    const obj = args.object as RegisterDto;
    return obj.password === passwordRepeat;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Passwords don`t match';
  }
}
