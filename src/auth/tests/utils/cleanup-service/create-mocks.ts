import { TestingModule, Test } from "@nestjs/testing";
import { TokenCleanupService } from "src/auth/token-cleanup.service";
import { UsersService } from "src/users/users.service";
import { FakeUser } from "test/utils/entities/user";
import { createUsersServiceMock } from "test/utils/mocks/users.service.mock";

export async function createMocks(users: FakeUser[]) {
  const usersServiceMock = createUsersServiceMock(users);

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      TokenCleanupService,
      { provide: UsersService, useValue: usersServiceMock }
    ],
  }).compile();

  return [
    module.get<TokenCleanupService>(TokenCleanupService),
    usersServiceMock
  ] as const;
}