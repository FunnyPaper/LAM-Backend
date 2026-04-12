import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import configuration from "src/configuration/configuration";
import { EnvController } from "src/env/env.controller";
import { EnvService } from "src/env/env.service";
import { FakeUser } from "test/utils/entities/user";
import { createEnvServiceMock } from "test/utils/mocks/env.service.mock";

export async function createMocks(users: FakeUser[]) {
    const envServiceMock = createEnvServiceMock(users);

    const module: TestingModule = await Test.createTestingModule({
        controllers: [EnvController],
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
        module.get<EnvController>(EnvController),
        envServiceMock
    ] as const;
}