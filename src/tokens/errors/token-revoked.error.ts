import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class TokenRevokedError extends DomainError {
  public constructor(userId: string) {
    super(
      "User token has been revoked.",
      DomainErrorCodes.tokenRevoked,
      { userId }
    )
  }
}