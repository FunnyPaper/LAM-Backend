import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class UserNotFoundError extends DomainError {
  public constructor() {
    super(
      'User has not been found.',
      DomainErrorCodes.userNotFound
    );
  }
}