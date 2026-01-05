import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";
import { ScriptVersionStatusEnum } from "../enums/script-version-status.enum";

export class NonDraftScriptVersionUpdateError extends DomainError {
  public constructor(
    userId: string, 
    scriptId: string, 
    scriptVersionId: string, 
    status: ScriptVersionStatusEnum
  ) {
    super(
      `Attempted to update version with status ${status}. Only drafts can be updated.`,
      DomainErrorCodes.nonDraftScriptVersionUpdate,
      { userId, scriptId, scriptVersionId, status }
    )
  }
}