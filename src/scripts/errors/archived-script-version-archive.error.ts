import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";
import { ScriptVersionStatusEnum } from "../enums/script-version-status.enum";

export class ArchivedScriptVersionArchiveError extends DomainError {
    public constructor(
        userId: string,
        scriptId: string,
        scriptVersionId: string,
        status: ScriptVersionStatusEnum
    ) {
        super(
            `Attempted to archive version with status ${status}. Only non-archived versions can be archived.`,
            DomainErrorCodes.archivedScriptVersionArchive,
            { userId, scriptId, scriptVersionId, status }
        )
    }
}