import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationType } from './types/configuration.type';

@Module({})
export class ConfigurationModule {
    static register(configuration: () => Promise<ConfigurationType> | ConfigurationType): DynamicModule {
        return {
            module: ConfigurationModule,
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration]
                })
            ]
        }
    }
}
