import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EnvEntity } from "src/env/entities/env.entity";
import { EnvService } from "src/env/env.service";
import { UsersService } from "src/users/users.service";
import { FakeUser } from "test/utils/entities/user";
import { createEnvRepositoryMock } from "test/utils/mocks/env.repository.mock";
import { createUsersServiceMock } from "test/utils/mocks/users.service.mock";

export async function createMocks(users: FakeUser[]) {
  const envRepositoryMock = createEnvRepositoryMock(users.flatMap(u => u.envs!).filter(e => !!e));
  const usersServiceMock = createUsersServiceMock(users);

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      EnvService,
      { provide: getRepositoryToken(EnvEntity), useValue: envRepositoryMock },
      { provide: UsersService, useValue: usersServiceMock }
    ],
  }).compile();

  return [
    module.get<EnvService>(EnvService),
    envRepositoryMock,
    usersServiceMock
  ] as const;
}