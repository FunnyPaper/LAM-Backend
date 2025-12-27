import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(
    private userService: UsersService
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async cleanExpiredTokens() {
    const deleted = await this.userService.clearExpiredRefreshTokens();

    if(deleted > 0) {
      this.logger.log(`Cleaned up ${deleted} expired refresh tokens`);
    }
  }
}
