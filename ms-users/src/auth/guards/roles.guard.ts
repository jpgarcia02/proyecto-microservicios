import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1️⃣ Leer los roles requeridos
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // si no hay roles, cualquiera puede pasar

    // 2️⃣ Obtener el usuario del request (viene del JWT)
    const { user } = context.switchToHttp().getRequest();
    console.log('Usuario en RolesGuard:', user);

    // 3️⃣ Validar si el rol del usuario está permitido
    return requiredRoles.includes(user.role);
  }
}
