import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class CredentialMismatchError extends DomainError {
  public constructor(username: string) {
    super(
      "Username and password are not matching.",
      DomainErrorCodes.credentialMismatch,
      { username }
    )
  }
}
