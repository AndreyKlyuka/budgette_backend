import { JwtAuthGuard } from './jwt-auth.guard';
import { RoleGuard } from './role.guard';

export const GUARDS = [JwtAuthGuard, RoleGuard];
