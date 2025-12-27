import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { AccessControlModule } from 'nest-access-control';
import appRoles from './app.roles';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    ScheduleModule.forRoot(),
    AccessControlModule.forRoles(appRoles), 
    AuthModule,
    UsersModule, 
    DatabaseModule, 
    ConfigurationModule,
  ],
})
export class AppModule {}
