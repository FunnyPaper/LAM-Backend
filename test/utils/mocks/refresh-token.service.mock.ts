import { RefreshTokenService } from "src/tokens/refresh-token.service";

export function createRefreshTokenServiceMock() {
  return {
    create: jest.fn().mockImplementation(),
    removeById: jest.fn().mockImplementation(),
    removeExpired: jest.fn().mockImplementation()
  } satisfies Pick<RefreshTokenService, 
    | 'create'
    | 'removeById'
    | 'removeExpired'
  >
}