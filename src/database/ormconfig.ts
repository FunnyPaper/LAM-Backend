import { ConfigurationType } from '../configuration/types/configuration.type';
import { ConfigService } from "@nestjs/config"
import { UserEntity } from '../users/entities/user.entity';
import { RefreshTokenEntity } from '../tokens/entities/refresh-token.entity';
import { DataSourceOptions } from 'typeorm';
import { EnvEntity } from 'src/env/entities/env.entity';
import { ScriptEntity } from 'src/scripts/entities/script.entity';
import { ScriptVersionEntity } from 'src/scripts/entities/script-version.entity';
import { ScriptSourceEntity } from 'src/scripts/entities/script-source.entity';
import { ScriptRunEntity } from 'src/scripts/entities/script-run.entity';
import { ScriptRunResultEntity } from 'src/scripts/entities/script-run-result.entity';
import { ScriptContentEntity } from 'src/scripts/entities/script-content.entity';

export const ormconfig = (
  configService: ConfigService
): DataSourceOptions => {
  const dbConfig: ConfigurationType['database'] = configService.get('database')!;
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

  if(dbConfig.type === 'sqlite') {
    return {
      type: 'sqlite',
      database: dbConfig.database!,
      entities: entities,
      migrations: ['./dist/migrations/local/*.js'],
      synchronize: dbConfig.synchronize
    }
  }

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: entities,
    migrations: ['./dist/migrations/remote/*.js'],
    synchronize: dbConfig.synchronize
  }
}
