import { ConfigurationType } from '../configuration/types/configuration.type';
import { ConfigService } from "@nestjs/config"
import { UserEntity } from '../users/entities/user.entity';
import { RefreshTokenEntity } from '../tokens/entities/refresh-token.entity';
import { DataSourceOptions } from 'typeorm';

export const ormconfig = (
  configService: ConfigService
): DataSourceOptions => {
  const dbConfig: ConfigurationType['database'] = configService.get('database')!;

  if(dbConfig.type === 'sqlite') {
    return {
      type: 'sqlite',
      database: dbConfig.database!,
      entities: [UserEntity, RefreshTokenEntity],
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
    entities: [UserEntity, RefreshTokenEntity],
    migrations: ['./dist/migrations/remote/*.js'],
    synchronize: dbConfig.synchronize
  }
}
