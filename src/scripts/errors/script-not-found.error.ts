import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class ScriptNotFoundError extends DomainError {
  public constructor(userId: string, scriptId: string) {
    super(
      "Script has not been found",
      DomainErrorCodes.scriptNotFound,
      { userId, scriptId }
    )
  }
}