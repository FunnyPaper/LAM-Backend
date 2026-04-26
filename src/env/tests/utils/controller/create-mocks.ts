import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import configuration from "src/configuration/configuration";
import { EnvAnyController } from "src/env/env.any.controller";
import { EnvService } from "src/env/env.service";
import { FakeUser } from "test/utils/entities/user";
import { createEnvServiceMock } from "test/utils/mocks/env.service.mock";

export async function createMocks(users: FakeUser[]) {
    const envServiceMock = createEnvServiceMock(users);

    const module: TestingModule = await Test.createTestingModule({
        controllers: [EnvAnyController],
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [() => configuration('.env.test')]
            })
        ],
        providers: [
            { provide: EnvService, useValue: envServiceMock },
            { provide: '__roles_builder__', useValue: {} }
        ],
    }).compile();

    return [
        module.get<EnvAnyController>(EnvAnyController),
        envServiceMock
    ] as const;
}