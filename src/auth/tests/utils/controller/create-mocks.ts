import { TestingModule, Test } from "@nestjs/testing";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "src/users/users.service";
import { FakeUser } from "test/utils/entities/user";
import { createAuthServiceMock } from "test/utils/mocks/auth.service.mock";
import { createUsersServiceMock } from "test/utils/mocks/users.service.mock";

export async function createMocks(users: FakeUser[]) {
  const authServiceMock = createAuthServiceMock(users);
  const usersServiceMock = createUsersServiceMock(users);

  const module: TestingModule = await Test.createTestingModule({
    controllers: [AuthController],
    providers:[
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