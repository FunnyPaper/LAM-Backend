import {
  Injectable,
  Inject,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class IdempotencyService {
  private readonly TTL_SECONDS = 60 * 5; // 5 minutes

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  private responseKey(key: string) {
    return `idempotency:response:${key}`;
  }

  private lockKey(key: string) {
    return `idempotency:lock:${key}`;
  }

  async getResponse(key: string): Promise<unknown> {
    const cached = await this.redis.get(this.responseKey(key));
    return cached ? JSON.parse(cached) : null;
  }

  async acquireLock(key: string): Promise<boolean> {
    const result = await this.redis.set(this.lockKey(key), 'locked', 'EX', 30, 'NX');

    return result === 'OK';
  }

  async saveResponse(key: string, response: any): Promise<void> {
    await this.redis.set(
      this.responseKey(key),
      JSON.stringify(response),
      'EX',
      this.TTL_SECONDS,
    );
  }

  async releaseLock(key: string): Promise<void> {
    await this.redis.del(this.lockKey(key));
  }
}
