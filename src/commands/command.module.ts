import { ConfigurationModule } from "../configuration/configuration.module";
import { DatabaseModule } from "../database/database.module";
import { UsersModule } from "../users/users.module";
import { DynamicModule, Module } from "@nestjs/common";
import { InitCommand } from "./init.command";
import { SharedModule } from "src/shared/shared.module";
import { AccessControlModule } from "nest-access-control";
import appRoles from "src/app.roles";
import { ConfigurationType } from "src/configuration/types/configuration.type";

@Module({
    imports: [
        SharedModule,
        AccessControlModule.forRoles(appRoles),
        UsersModule,
        DatabaseModule,
    ],
    providers: [InitCommand]
})
export class CommandModule {
    public static register(configuration: () => Promise<ConfigurationType> | ConfigurationType): DynamicModule {
        return {
            module: CommandModule,
            imports: [
                ConfigurationModule.register(configuration)
            ]
        }
    }
}
