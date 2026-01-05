import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";
import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";

export class ScriptRunRemoveStatusError extends DomainError {
  public constructor(userId: string, scriptRunId: string, scriptRunStatus: ScriptRunStatusEnum) {
    super(
      `Attempted to delete script in ${scriptRunStatus} state. Script must finish its execution or be cancelled before removing.`,
      DomainErrorCodes.scriptRunRemoveStatus,
      { userId, scriptRunId, scriptRunStatus }
    )
  }
}