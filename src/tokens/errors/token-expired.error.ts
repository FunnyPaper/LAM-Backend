import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class TokenExpiredError extends DomainError {
  public constructor(tokenId: string, userId: string, expiredAt: Date) {
    super(
      `Provided token has expired at ${expiredAt.toLocaleDateString()}`,
      DomainErrorCodes.tokenExpired,
      { tokenId, userId, expiredAt }
    )
  }
}