import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";
import { ScriptVersionStatusEnum } from "../enums/script-version-status.enum";

export class NonDraftScriptVersionPublishError extends DomainError {
  public constructor(
    userId: string, 
    scriptId: string, 
    scriptVersionId: string, 
    status: ScriptVersionStatusEnum
  ) {
    super(
      `Attempted to publish version with status ${status}. Only drafts can be published.`,
      DomainErrorCodes.nonDraftScriptVersionUpdate,
      { userId, scriptId, scriptVersionId, status }
    )
  }
}