import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Role } from '../../app.roles';

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const role = req.user.roles[0];
    const id = req.user.id;
    const paramId = req.params.id;

    return role == Role.ADMIN || id === paramId;
  }
}
