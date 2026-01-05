import { Module } from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import { IdempotencyService } from './idempotency.service';
import { IdempotencyInterceptor } from './idempotency.interceptor';

@Module({
  providers: [
    RedisProvider,
    IdempotencyService,
    IdempotencyInterceptor,
  ],
  exports: [IdempotencyInterceptor],
})
export class IdempotencyModule {}
