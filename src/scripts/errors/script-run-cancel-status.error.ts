import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";
import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";

export class ScriptRunCancelStatusError extends DomainError {
  public constructor(userId: string, scriptRunId: string, scriptRunStatus: ScriptRunStatusEnum) {
    super(
      `Attempted to cancel script in ${scriptRunStatus} state. Script must be running or be quried for execution.`,
      DomainErrorCodes.scriptRunCancelStatus,
      { userId, scriptRunId, scriptRunStatus }
    )
  }
}