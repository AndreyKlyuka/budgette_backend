import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DecoratorConfig } from '@constants';

export const Public = () => SetMetadata(DecoratorConfig.PUBLIC_KEY, true);
export const isPublic = (ctx: ExecutionContext, reflector: Reflector) => {
  return reflector.getAllAndOverride<boolean>(DecoratorConfig.PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
};
