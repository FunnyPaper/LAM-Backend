import { RefreshTokenEntity } from "src/tokens/entities/refresh-token.entity"
import { FakeRefreshToken } from "test/utils/entities/refresh-token"
import { Repository } from "typeorm"

export function createRefreshTokenRepositoryMock(tokens: FakeRefreshToken[]) {
  return {
    create: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    delete: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation().mockReturnValue(Promise.resolve(tokens))
  } satisfies Pick<Repository<RefreshTokenEntity>,
    | 'create' 
    | 'save' 
    | 'delete'
    | 'find'
  >
}