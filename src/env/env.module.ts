import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { EnvController } from './env.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvEntity } from './entities/env.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnvEntity]),
    UsersModule
  ],
  controllers: [EnvController],
  providers: [EnvService],
  exports: [EnvService]
})
export class EnvModule {}
