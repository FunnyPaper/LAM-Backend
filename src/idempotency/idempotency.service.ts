import {
    Injectable
} from '@nestjs/common';

@Injectable()
export class IdempotencyService {
    private readonly TTL_SECONDS = 60 * 5;
    private readonly cache = new Map<string, { response: any; expiresAt: number }>();
    private readonly locks = new Map<string, { expiresAt: number }>();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredEntries();
        }, 60000);
    }

    private cleanupExpiredEntries() {
        const now = Date.now();

        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }

        for (const [key, entry] of this.locks.entries()) {
            if (now > entry.expiresAt) {
                this.locks.delete(key);
            }
        }
    }

    private responseKey(key: string) {
        return `idempotency:response:${key}`;
    }

    private lockKey(key: string) {
        return `idempotency:lock:${key}`;
    }

    getResponse(key: string): unknown {
        const cacheKey = this.responseKey(key);
        const entry = this.cache.get(cacheKey);

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(cacheKey);
            return null;
        }

        return entry.response;
    }

    acquireLock(key: string): boolean {
        const lockKey = this.lockKey(key);

        if (this.locks.has(lockKey)) {
            return false;
        }

        this.locks.set(lockKey, {
            expiresAt: Date.now() + 30000,
        });

        return true;
    }

    saveResponse(key: string, response: any): void {
        const cacheKey = this.responseKey(key);

        this.cache.set(cacheKey, {
            response,
            expiresAt: Date.now() + (this.TTL_SECONDS * 1000),
        });
    }

    releaseLock(key: string): void {
        const lockKey = this.lockKey(key);
        this.locks.delete(lockKey);
    }

    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}