import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { LessThan, Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class RefreshTokenService {
  public constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repo: Repository<RefreshTokenEntity>
  ) {}

  public async create(config: {
    hash: string,
    user: UserEntity,
    expires: Date
  }) {
    const { hash, user, expires } = config;

    const token = this.repo.create({
        tokenHash: hash,
        user,
        expiresAt: expires
    });

    await this.repo.save(token);
  }

  public async removeById(id: string) {
    await this.repo.delete({ id });
  }

  public async removeExpired() {
    await this.repo
      .find({ where: { expiresAt: LessThan(new Date() )}})
      .then(tokens => Promise.all(tokens.map(token => this.repo.delete({ id: token.id }))));
  }
}
