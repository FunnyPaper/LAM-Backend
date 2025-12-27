import { ConfigurationModule } from "../configuration/configuration.module";
import { DatabaseModule } from "../database/database.module";
import { UsersModule } from "../users/users.module";
import { Module } from "@nestjs/common";
import { InitCommand } from "./init.command";
import { SharedModule } from "src/shared/shared.module";
import { AccessControlModule } from "nest-access-control";
import appRoles from "src/app.roles";

@Module({
  imports: [
    SharedModule,
    AccessControlModule.forRoles(appRoles), 
    UsersModule, 
    DatabaseModule, 
    ConfigurationModule,
  ],
  providers: [InitCommand]
})
export class CommandModule {}
