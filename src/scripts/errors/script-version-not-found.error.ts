import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class ScriptVersionNotFoundError extends DomainError {
  public constructor(userId: string, scriptId: string | undefined, scriptVersionId: string) {
    super(
      "Script version has not been found",
      DomainErrorCodes.scriptVersionNotFound,
      { userId, scriptId, scriptVersionId }
    )
  }
}