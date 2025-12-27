import { UsersService } from "src/users/users.service";
import { FakeUser } from "test/utils/entities/user";
import { createUser } from "test/utils/factories/users.factory";

export function createUsersServiceMock(users: FakeUser[]) {
  return {
    tryCreate: jest.fn().mockImplementation(dto => createUser({ 
      overrides: { 
        username: dto.username, 
        password: dto.password, 
        role: dto.role 
      }})
    ),
    tryCreateWithSupervisor: jest.fn().mockImplementation(dto => createUser({ 
      overrides: { 
        username: dto.username, 
        password: dto.password, 
        role: dto.role 
      }})
    ),
    tryFindOneByUsername: jest.fn().mockImplementation((username: string) => 
      users.find(user => user.username == username)
    ),
    findById: jest.fn().mockImplementation((id: string) => 
      Promise.resolve(users.find(user => user.id == id))
    ),
    tryFindByIdWithRefreshToken: jest.fn().mockImplementation((id: string) => 
      Promise.resolve(users.find(user => user.id == id))
    ),
    clearRefreshToken: jest.fn().mockImplementation(),
    clearExpiredRefreshTokens: jest.fn().mockImplementation().mockReturnValue(
      users.filter(u => !u.refreshToken || u.refreshToken.expiresAt!.getTime() < Date.now()).length
    ),
    findAll: jest.fn().mockImplementation().mockReturnValue(Promise.resolve(users)),
  } satisfies Pick<UsersService, 
    | 'tryCreate'
    | 'tryCreateWithSupervisor'
    | 'tryFindOneByUsername'
    | 'findById'
    | 'tryFindByIdWithRefreshToken'
    | 'clearRefreshToken'
    | 'clearExpiredRefreshTokens'
    | 'findAll'
  >
}