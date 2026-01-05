import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { isUUID } from "class-validator";
import { Role } from "src/app.roles";

@Injectable()
export class UserRequestIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    const queryUserId = req.query.userId;

    if (!user.roles.includes(Role.ADMIN)) {
      req.requestUserId = user.id;
    } else if(queryUserId) {
      if(queryUserId == 'me') {
        req.requestUserId = user.id;
      } else if(!isUUID(queryUserId)) {
        throw new UnprocessableEntityException();
      } else {
        req.requestUserId = queryUserId;
      }
    }

    return true;
  }
}
