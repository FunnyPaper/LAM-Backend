import { TestingModule, Test } from "@nestjs/testing";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";
import { FakeUser } from "test/utils/entities/user";
import { createUsersServiceMock } from "test/utils/mocks/users.service.mock";

export async function createMocks(users: FakeUser[]) {
  const usersServiceMock = createUsersServiceMock(users);

  const module: TestingModule = await Test.createTestingModule({
    controllers: [UsersController],
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
