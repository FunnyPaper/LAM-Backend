import { HttpStatus } from "@nestjs/common";
import { DomainErrorCode } from '../errors/domain.error';

const map: Record<DomainErrorCode, HttpStatus> = {
  CREDENTIAL_MISMATCH: HttpStatus.UNAUTHORIZED,
  INSUFFICIENT_PRIVILEGES: HttpStatus.FORBIDDEN,
  INVALID_TOKEN: HttpStatus.UNAUTHORIZED,
  TOKEN_EXPIRED: HttpStatus.UNAUTHORIZED,
  TOKEN_REVOKED: HttpStatus.UNAUTHORIZED,
  USER_NOT_FOUND: HttpStatus.NOT_FOUND,
  USERNAME_TAKEN: HttpStatus.CONFLICT
}

export function mapDomainErrorStatus(code: string) {
  return map[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
}