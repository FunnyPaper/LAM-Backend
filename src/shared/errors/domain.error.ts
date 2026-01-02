export class DomainError extends Error {
  public constructor(
    public message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
  }
}

export const DomainErrorCodes = {
  credentialMismatch: "CREDENTIAL_MISMATCH",
  insufficientPrivileges: "INSUFFICIENT_PRIVILEGES",
  invalidToken: "INVALID_TOKEN",
  tokenExpired: "TOKEN_EXPIRED",
  tokenRevoked: "TOKEN_REVOKED",
  userNotFound: "USER_NOT_FOUND",
  usernameTaken: "USERNAME_TAKEN",
  envNotFound: "ENV_NOT_FOUND"
} as const;

export type DomainErrorCode = typeof DomainErrorCodes[keyof typeof DomainErrorCodes];