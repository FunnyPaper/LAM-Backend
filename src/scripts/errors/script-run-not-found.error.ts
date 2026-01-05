import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class ScriptRunNotFoundError extends DomainError {
  public constructor(userId: string, scriptRunId: string) {
    super(
      "Script run has not been found",
      DomainErrorCodes.scriptRunNotFound,
      { userId, scriptRunId }
    )
  }
}