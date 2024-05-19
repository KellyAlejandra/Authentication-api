import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.enum';

export const META_ROLES = "roles";
export const RoleProtected = (...args: ValidRoles[]) => SetMetadata(META_ROLES, args);
