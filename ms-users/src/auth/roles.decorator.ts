import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';  // clave de metadata
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
