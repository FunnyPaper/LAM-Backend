import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StartedPostgreSqlContainer, PostgreSqlContainer } from '@testcontainers/postgresql';
import { RefreshTokenEntity } from '../../../src/tokens/entities/refresh-token.entity';
import { UserEntity } from '../../../src/users/entities/user.entity';

@Module({})
export class TestDatabaseModule {
  static async forRoot(type: 'local' | 'remote' ): Promise<DynamicModule> {
    if (type === 'local') {
      return {
        module: TestDatabaseModule,
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: [UserEntity, RefreshTokenEntity],
            synchronize: true,
          }),
        ],
      };
    }

    const container: StartedPostgreSqlContainer = await new PostgreSqlContainer('postgres:16-alpine').start();

    return {
      module: TestDatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getPort(),
          username: container.getUsername(),
          password: container.getPassword(),
          database: container.getDatabase(),
          entities: [UserEntity, RefreshTokenEntity],
          synchronize: true,
          dropSchema: true,
        }),
      ],
      providers: [
        {
          provide: 'POSTGRES_CONTAINER',
          useValue: container,
        },
      ],
      exports: ['POSTGRES_CONTAINER'],
    };
  }
}
