import { ArgumentsHost, Catch } from "@nestjs/common";
import { ExceptionFilter } from "@nestjs/common";
import { DomainError } from "../errors/domain.error";
import { mapDomainErrorStatus } from "./map-domain-error-status";

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    response.status(mapDomainErrorStatus(error.code)).json({
      error: error.code,
      message: error.message,
    });
  }
}