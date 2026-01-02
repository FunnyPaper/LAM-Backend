import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Role } from '../../app.roles';

export function UserOwnershipGuardFactory(idFieldName: string = 'id') {
  @Injectable()
  class UserOwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      if (!req.user) return false;

      const isAdmin = req.user.roles.includes(Role.ADMIN);
      const id = req.user.id;
      const paramId = req.params[idFieldName];

      return isAdmin || String(id) === String(paramId);
    }
  }

  return UserOwnershipGuard;
}