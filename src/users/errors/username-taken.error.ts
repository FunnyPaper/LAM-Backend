import { DomainError, DomainErrorCodes } from "src/shared/errors/domain.error";

export class UsernameTakenError extends DomainError {
  public constructor(username: string) {
    super(
      "Username has been already taken.",
      DomainErrorCodes.usernameTaken,
      { username }
    )
  }
}