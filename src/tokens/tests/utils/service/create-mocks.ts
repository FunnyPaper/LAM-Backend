import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RefreshTokenEntity } from "src/tokens/entities/refresh-token.entity";
import { RefreshTokenService } from "src/tokens/refresh-token.service";
import { FakeRefreshToken } from "test/utils/entities/refresh-token";
import { createRefreshTokenRepositoryMock } from "test/utils/mocks/refresh-token.repository.mock";

export async function createMocks(tokens: FakeRefreshToken[]) {
  const refreshTokenRepoMock = createRefreshTokenRepositoryMock(tokens);

  const module: TestingModule = await Test.createTestingModule({
    providers: [RefreshTokenService,
      { provide: getRepositoryToken(RefreshTokenEntity), useValue: refreshTokenRepoMock }
    ],
  }).compile();

  return [
    module.get<RefreshTokenService>(RefreshTokenService), 
    refreshTokenRepoMock
  ] as const;
}