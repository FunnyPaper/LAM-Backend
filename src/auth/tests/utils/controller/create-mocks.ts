import { ConfigModule } from "@nestjs/config";
import { TestingModule, Test } from "@nestjs/testing";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import configuration from "src/configuration/configuration";
import { UsersService } from "src/users/users.service";
import { FakeUser } from "test/utils/entities/user";
import { createAuthServiceMock } from "test/utils/mocks/auth.service.mock";
import { createUsersServiceMock } from "test/utils/mocks/users.service.mock";

export async function createMocks(users: FakeUser[]) {
    const authServiceMock = createAuthServiceMock(users);
    const usersServiceMock = createUsersServiceMock(users);

    const module: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [() => configuration('.env.test')]
            })
        ],
        providers: [
            { provide: AuthService, useValue: authServiceMock },
            { provide: UsersService, useValue: usersServiceMock },
        ]
    }).compile();

    return [
        module.get<AuthController>(AuthController),
        authServiceMock,
        usersServiceMock
    ] as const;
}