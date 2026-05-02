import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class PublishedScriptVersionPublishError extends DomainError {
  public constructor(
    userId: string,
    scriptId: string,
    scriptVersionId: string,
  ) {
    super(
      `Attempted to publish version with status Published. Only drafts and archived versions can be published.`,
      DomainErrorCodes.publishedScriptVersionUpdate,
      { userId, scriptId, scriptVersionId }
    )
  }
}