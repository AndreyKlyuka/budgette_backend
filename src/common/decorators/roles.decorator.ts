import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
import { DecoratorConfig } from '@constants';

export const Roles = (...roles: Role[]) => SetMetadata(DecoratorConfig.ROLES_KEY, roles);
