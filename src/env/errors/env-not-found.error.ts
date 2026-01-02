import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class EnvNotFoundError extends DomainError {
  public constructor(userId: string, envId: string) {
    super(
      "Env has not been found.",
      DomainErrorCodes.envNotFound,
      { userId, envId }
    )
  }
}