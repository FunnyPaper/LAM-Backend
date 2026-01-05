import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class ScriptRunCreateFromUnpublishedError extends DomainError {
  public constructor(userId, scriptVersionId, scriptVersionStatus) {
    super(
      `Attempted to run script with ${scriptVersionStatus} status. Only published scripts can be executed.`,
      DomainErrorCodes.createScriptRunFromUnpublished,
      { userId, scriptVersionId, scriptVersionStatus}
    )
  }
}