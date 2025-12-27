import { JwtService } from "@nestjs/jwt";
import { TestingModule, Test } from "@nestjs/testing";
import { AuthService } from "src/auth/auth.service";
import { HashService } from "src/shared/providers/hash.service";
import { RefreshTokenService } from "src/tokens/refresh-token.service";
import { UsersService } from "src/users/users.service";
import { FakeUser } from "test/utils/entities/user";
import { createJwtServiceMock } from "test/utils/mocks/jwt.service.mock";
import { createRefreshTokenServiceMock } from "test/utils/mocks/refresh-token.service.mock";
import { createUsersServiceMock } from "test/utils/mocks/users.service.mock";

export async function createMocks(users: FakeUser[]) {
  const usersServiceMock = createUsersServiceMock(users) 
  const jwtServiceMock = createJwtServiceMock();
  const refreshTokenServiceMock = createRefreshTokenServiceMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      HashService,
      { provide: UsersService, useValue: usersServiceMock },
      { provide: JwtService, useValue: jwtServiceMock },
      { provide: RefreshTokenService, useValue: refreshTokenServiceMock },
    ],
  }).compile();
  
  return [
    module.get<AuthService>(AuthService),
    usersServiceMock,
    jwtServiceMock,
    refreshTokenServiceMock
  ] as const;
}
