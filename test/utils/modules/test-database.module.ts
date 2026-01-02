import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StartedPostgreSqlContainer, PostgreSqlContainer } from '@testcontainers/postgresql';
import { RefreshTokenEntity } from '../../../src/tokens/entities/refresh-token.entity';
import { UserEntity } from '../../../src/users/entities/user.entity';
import { EnvEntity } from 'src/env/entities/env.entity';
import { ScriptContentEntity } from 'src/scripts/entities/script-content.entity';
import { ScriptRunResultEntity } from 'src/scripts/entities/script-run-result.entity';
import { ScriptRunEntity } from 'src/scripts/entities/script-run.entity';
import { ScriptSourceEntity } from 'src/scripts/entities/script-source.entity';
import { ScriptVersionEntity } from 'src/scripts/entities/script-version.entity';
import { ScriptEntity } from 'src/scripts/entities/script.entity';

@Module({})
export class TestDatabaseModule {
  static async forRoot(type: 'local' | 'remote' ): Promise<DynamicModule> {
    const entities = [
      UserEntity, 
      RefreshTokenEntity, 
      EnvEntity,
      ScriptEntity,
      ScriptVersionEntity,
      ScriptSourceEntity,
      ScriptRunEntity,
      ScriptRunResultEntity,
      ScriptContentEntity
    ]

    if (type === 'local') {
      return {
        module: TestDatabaseModule,
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: entities,
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
          entities: entities,
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
