import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const USER_AGENT: string = 'user-agent';
export const UserAgent = createParamDecorator((_: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers[USER_AGENT];
});
