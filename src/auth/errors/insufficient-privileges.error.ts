import { Role } from "src/app.roles";
import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class InsufficientPrivilegesError extends DomainError {
  public constructor(userId: string, requiredRole: Role, providedRole: Role) {
    super(
      `Tried to perform action with insufficient privileges. Required ${requiredRole}, but ${providedRole} was provided.`, 
      DomainErrorCodes.insufficientPrivileges, 
      { userId, requiredRole, providedRole }
    );
  }
}