import { Module } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { ScriptsController } from './scripts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptEntity } from './entities/script.entity';
import { ScriptVersionEntity } from './entities/script-version.entity';
import { ScriptSourceEntity } from './entities/script-source.entity';
import { ScriptRunEntity } from './entities/script-run.entity';
import { ScriptRunResultEntity } from './entities/script-run-result.entity';
import { ScriptContentEntity } from './entities/script-content.entity';
import { ScriptsRunsController } from './scripts-runs.controller';
import { ScriptsVersionsController } from './scripts-versions.controller';
import { EnvModule } from 'src/env/env.module';
import { UsersModule } from 'src/users/users.module';
import { ScriptsRunsService } from './scripts-runs.service';
import { ScriptsVersionsService } from './scripts-versions.service';
import { ScriptRunGateway } from './gateways/script-run.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WORKER_PACKAGE_NAME, WORKER_SERVICE_NAME } from 'src/proto/worker';
import { ScriptsRunsGrpcClientService } from './scripts-runs-grpc-client.service';
import { AuthModule } from 'src/auth/auth.module';
import { ScriptsRunsProcessor } from './processors/scripts-runs.processor';
import { IdempotencyModule } from 'src/idempotency/idempotency.module';
import { resolve } from "path";
import { ConfigService } from '@nestjs/config';
import { ConfigurationType, GRPCConfiguration } from 'src/configuration/types/configuration.type';

@Module({
    imports: [
        UsersModule,
        EnvModule,
        AuthModule,
        IdempotencyModule,
        ClientsModule.registerAsync({
            clients: [{
                name: WORKER_SERVICE_NAME,
                useFactory: (configService: ConfigService<ConfigurationType>) => {
                    const grpc: GRPCConfiguration = configService.get('grpc')!;
                    return {
                        transport: Transport.GRPC,
                        options: {
                            url: `${grpc.host}:${grpc.port}`,
                            package: WORKER_PACKAGE_NAME,
                            protoPath: resolve(configService.get('cwd')!, 'proto/worker.proto')
                        },
                    }
                },
                inject: [ConfigService]
            }]
        }),
        TypeOrmModule.forFeature([
            ScriptEntity,
            ScriptVersionEntity,
            ScriptSourceEntity,
            ScriptRunEntity,
            ScriptRunResultEntity,
            ScriptContentEntity,
        ])
    ],
    controllers: [
        ScriptsController,
        ScriptsRunsController,
        ScriptsVersionsController
    ],
    providers: [
        ScriptsService,
        ScriptsRunsService,
        ScriptsVersionsService,
        ScriptRunGateway,
        ScriptsRunsGrpcClientService,
        ScriptsRunsProcessor
    ],
})
export class ScriptsModule { }
