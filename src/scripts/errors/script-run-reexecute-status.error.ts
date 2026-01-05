import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";
import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";

export class ScriptRunReexecuteStatusError extends DomainError {
  public constructor(userId: string, scriptRunId: string, scriptRunStatus: ScriptRunStatusEnum) {
    super(
      `Attempted to reexecute script in ${scriptRunStatus} state. Script must finish its execution or be cancelled before being reexecuted.`,
      DomainErrorCodes.scriptRunReexecuteStatus,
      { userId, scriptRunId, scriptRunStatus }
    )
  }
}