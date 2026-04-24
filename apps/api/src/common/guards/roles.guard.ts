import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required?.length) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new ForbiddenException('Not authenticated');

    const hasRole = required.some(
      (role) =>
        user.role === role ||
        (role === UserRole.ADMIN && user.role === UserRole.SUPER_ADMIN),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Requires one of: ${required.join(', ')}`,
      );
    }

    return true;
  }
}
