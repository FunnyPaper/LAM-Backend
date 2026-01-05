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
  envNotFound: "ENV_NOT_FOUND",
  scriptNotFound: "SCRIPT_NOT_FOUND",
  scriptVersionNotFound: "SCRIPT_VERSION_NOT_FOUND",
  nonDraftScriptVersionUpdate: "NON_DRAFT_SCRIPT_VERSION_UPDATE",
  nonDraftScriptVersionPublish: "NON_DRAFT_SCRIPT_VERSION_PUBLISH",
  scriptRunNotFound: "SCRIPT_RUN_NOT_FOUND",
  scriptRunRemoveStatus: "SCRIPT_RUN_REMOVE_STATUS",
  scriptRunCancelStatus: "SCRIPT_RUN_CANCEL_STATUS",
  scriptRunReexecuteStatus: "SCRIPT_RUN_REEXECUTE_STATUS",
  createScriptRunFromUnpublished: "UNPUBLISHED_SCRIPT_RUN_ATTEMPT"
} as const;

export type DomainErrorCode = typeof DomainErrorCodes[keyof typeof DomainErrorCodes];