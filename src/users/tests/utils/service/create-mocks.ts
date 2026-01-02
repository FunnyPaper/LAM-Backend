import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HashService } from "src/shared/providers/hash.service";
import { RefreshTokenService } from "src/tokens/refresh-token.service";
import { UserEntity } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { FakeUser } from "test/utils/entities/user";
import { createRefreshTokenServiceMock } from "test/utils/mocks/refresh-token.service.mock";
import { createUsersRepossitoryMock } from "test/utils/mocks/users.repository.mock";

export async function createMocks(users: FakeUser[]) {
  const refreshTokenServiceMock = createRefreshTokenServiceMock();
  const usersRepositoryMock = createUsersRepossitoryMock(users);

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UsersService,
      HashService,
      { provide: getRepositoryToken(UserEntity), useValue: usersRepositoryMock },
      { provide: RefreshTokenService, useValue: refreshTokenServiceMock }
    ],
  }).compile();

  return [
    module.get<UsersService>(UsersService),
    usersRepositoryMock,
    refreshTokenServiceMock
  ] as const;
}
