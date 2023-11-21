import { HttpException } from '@nestjs/common';
import { ErrorBody, ErrorCodeType } from '@exceptions';

export class BusinessException extends HttpException {
    constructor(code: ErrorCodeType) {
        super(ErrorBody[code], ErrorBody[code].statusCode);
    }
}
