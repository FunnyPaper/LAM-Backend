import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ConflictException,
  OnModuleDestroy,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IdempotencyService } from './idempotency.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor, OnModuleDestroy {
  constructor(
    private readonly idempotencyService: IdempotencyService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const key: string = req.headers['idempotency-key'];

    if (!key) {
      return next.handle();
    }

    const response = await this.idempotencyService.getResponse(key);
    if (response) {
      return of(response);
    }

    const lock = this.idempotencyService.acquireLock(key);
    if(!lock) {
      throw new ConflictException('Request is already being processed');
    }

    return next.handle().pipe(
      tap((response) => {
        this.idempotencyService.saveResponse(key, response);
        this.idempotencyService.releaseLock(key);
      })
    );
  }

  onModuleDestroy() {
    this.idempotencyService.onModuleDestroy();
  }
}
