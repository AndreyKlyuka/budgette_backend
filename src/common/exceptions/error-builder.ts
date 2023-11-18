import { HttpStatus } from '@nestjs/common';

enum AppErrorCode {
    USER_EMAIL_ALREADY_EXIST = 'User with this email already exist!',
    INCORRECT_PASSWORD_OR_EMAIL = 'An incorrect email or password',
    BAD_REQUEST_TO_REGISTER_USER = 'Unable to create user with this data',
    BAD_REQUEST_TO_LOGIN_USER = 'Unable to login user with this data',
}
export const ErrorCode = { ...AppErrorCode };

export type ErrorCodeType = AppErrorCode;

type ErrorBodyType = {
    [code in ErrorCodeType]: { statusCode: HttpStatus; message: string };
};

export const ErrorBody: ErrorBodyType = {
    [ErrorCode.USER_EMAIL_ALREADY_EXIST]: {
        statusCode: HttpStatus.CONFLICT,
        message: ErrorCode.USER_EMAIL_ALREADY_EXIST,
    },
    [ErrorCode.INCORRECT_PASSWORD_OR_EMAIL]: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ErrorCode.INCORRECT_PASSWORD_OR_EMAIL,
    },
    [ErrorCode.BAD_REQUEST_TO_REGISTER_USER]: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ErrorCode.BAD_REQUEST_TO_REGISTER_USER,
    },
    [ErrorCode.BAD_REQUEST_TO_LOGIN_USER]: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ErrorCode.BAD_REQUEST_TO_LOGIN_USER,
    },
};
