import { HttpStatus } from '@nestjs/common';

enum AppErrorCode {
    USER_EMAIL_ALREADY_EXIST = 'User with this email already exist!',
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
};
