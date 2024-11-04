import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecoratorConfig } from '@constants';

export const UserAgent = createParamDecorator((_: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers[DecoratorConfig.USER_AGENT_KEY];
});
