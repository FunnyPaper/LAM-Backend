import { ConfigModule } from "@nestjs/config";
import { TestingModule, Test } from "@nestjs/testing";
import configuration from "src/configuration/configuration";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";
import { FakeUser } from "test/utils/entities/user";
import { createUsersServiceMock } from "test/utils/mocks/users.service.mock";

export async function createMocks(users: FakeUser[]) {
    const usersServiceMock = createUsersServiceMock(users);

    const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [() => configuration('.env.test')]
            })
        ],
        providers: [
            { provide: UsersService, useValue: usersServiceMock },
            { provide: '__roles_builder__', useValue: {} }
        ]
    }).compile();

    return [
        module.get<UsersController>(UsersController),
        usersServiceMock
    ] as const;
}
