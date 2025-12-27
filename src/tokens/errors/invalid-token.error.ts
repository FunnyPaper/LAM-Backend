import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class InvalidTokenError extends DomainError {
  public constructor(tokenId: string, userId: string) {
    super(
      "Provided token does not match the user's token.",
      DomainErrorCodes.invalidToken, 
      { tokenId, userId }
    );
  }
}