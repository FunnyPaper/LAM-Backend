import { AuthService } from "src/auth/auth.service"
import { FakeUser } from "test/utils/entities/user"

export function createAuthServiceMock(users: FakeUser[]) {
  return {
    login: jest.fn().mockImplementation().mockReturnValue(Promise.resolve({
      accessToken: 'token',
      refreshToken: 'token'
    })),
    logout: jest.fn().mockImplementation(({ username, role }) => ({ username, role })),
    refresh: jest.fn().mockImplementation().mockReturnValue(Promise.resolve({
      accessToken: 'token',
      refreshToken: 'token'
    })),   
    validateLocalUser: jest.fn().mockImplementation(({ username }) => {
      const user = users.find(user => user.username == username);
      return user && {
        id: user.id,
        username: user.username,
        roles: [user.role]
      }
    })
  } satisfies Pick<AuthService, 
    | 'login' 
    | 'logout' 
    | 'refresh'
    | 'validateLocalUser'
  > 
}