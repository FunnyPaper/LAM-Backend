import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Role } from '../../app.roles';
import { EnvService } from "../env.service";

export function EnvOwnershipGuardFactory(userIdFieldName: string, envIdFieldName: string) {
  @Injectable()
  class EnvOwnershipGuard implements CanActivate {
    public constructor(readonly envService: EnvService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      if (!req.user) return false;

      const isAdmin = req.user.roles.includes(Role.ADMIN);
      const id = req.user.id;
      const envId: string = req.params[envIdFieldName];
      const userId: string = req.params[userIdFieldName];
      const env = await this.envService.findByIdWithOwner(userId, envId);

      if(!env) return false;

      return isAdmin || String(id) === String(env.owner.id);
    }
  }

  return EnvOwnershipGuard;
}