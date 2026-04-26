import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { EnvAnyController } from './env.any.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvEntity } from './entities/env.entity';
import { EnvSelfController } from './env.self.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([EnvEntity]),
        UsersModule
    ],
    controllers: [EnvSelfController, EnvAnyController],
    providers: [EnvService],
    exports: [EnvService]
})
export class EnvModule { }
