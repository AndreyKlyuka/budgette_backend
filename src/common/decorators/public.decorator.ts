import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DecoratorsConstant } from '@constants';

export const Public = () => SetMetadata(DecoratorsConstant.PUBLIC_KEY, true);
export const isPublic = (ctx: ExecutionContext, reflector: Reflector) => {
    return reflector.getAllAndOverride<boolean>(DecoratorsConstant.PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
};
