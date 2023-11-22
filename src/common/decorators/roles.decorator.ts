import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
import { DecoratorsConstant } from '@constants';

export const Roles = (...roles: Role[]) => SetMetadata(DecoratorsConstant.ROLES_KEY, roles);
