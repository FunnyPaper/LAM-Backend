import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../users/users.service';
import { JwtStrategy } from '../jwt.strategy';
import { FakeUser } from 'test/utils/entities/user';
import { createUsersServiceMock } from 'test/utils/mocks/users.service.mock';
import { UserNotFoundError } from 'src/users/errors/user-not-found.error';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';

async function createMocks(users: FakeUser[]) {
  const usersServiceMock = createUsersServiceMock(users);
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      JwtStrategy,
      { provide: UsersService, useValue: usersServiceMock },
    ],
  }).compile();

  return [
    module.get<JwtStrategy>(JwtStrategy),
    usersServiceMock
  ] as const;
}

describe(JwtStrategy.name, () => {
  describe(`::${JwtStrategy.prototype.validate.name} should`, () => {
    it('check is user exists', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [strategy] = await createMocks([]);
      const payload = { sub: user.id, username: user.username, roles: user.role };

      await expect(strategy.validate(payload))
        .rejects
        .toThrow(UserNotFoundError);
    });

    it('return plain user data', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [strategy] = await createMocks([ user ]);
      const payload = { sub: user.id, username: user.username, roles: user.role };

      await expect(strategy.validate(payload))
        .resolves
        .toEqual({
          id: payload.sub,
          username: payload.username,
          roles: payload.roles
        })
    })
  })
});
