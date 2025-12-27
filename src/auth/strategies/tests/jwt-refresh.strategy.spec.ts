import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshStrategy } from '../jwt-refresh.strategy';
import { UsersService } from '../../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { createJwtServiceMock } from 'test/utils/mocks/jwt.service.mock';
import { createUsersServiceMock } from 'test/utils/mocks/users.service.mock';
import { UserNotFoundError } from 'src/users/errors/user-not-found.error';
import { TokenRevokedError } from 'src/tokens/errors/token-revoked.error';
import { InvalidTokenError } from 'src/tokens/errors/invalid-token.error';
import { createRefreshToken, createTokenHash } from 'test/utils/factories/refresh-token.factory';
import { FakeUser } from 'test/utils/entities/user';
import { createUser } from 'test/utils/factories/users.factory';
import { HashService } from 'src/shared/providers/hash.service';

async function createMocks(users: FakeUser[]) {
  const usersServiceMock = createUsersServiceMock(users);
  const jwtServiceMock = createJwtServiceMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      JwtRefreshStrategy,
      HashService,
      { provide: UsersService, useValue: usersServiceMock },
      { provide: JwtService, useValue: jwtServiceMock }
    ],
  }).compile();

  return [
    module.get<JwtRefreshStrategy>(JwtRefreshStrategy),
    usersServiceMock,
    jwtServiceMock
  ] as const;
}

describe(JwtRefreshStrategy.name, () => {
  describe(`::${JwtRefreshStrategy.prototype.validate.name} should`, () => {
    it('check is user exists', async () => {
      const [strategy] = await createMocks([]);
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const payload = { sub: user.id, username: user.username, roles: [user.role] };
      
      await expect(strategy.validate(payload))
        .rejects
        .toThrow(UserNotFoundError);
    });

    it("check if user have a valid refresh token", async () => {
      const user = await createUser();
      const [strategy] = await createMocks([ user ]);
      const payload = { sub: user.id, username: user.username, roles: [user.role] };

      await expect(strategy.validate(payload))
        .rejects
        .toThrow(TokenRevokedError);
    });

    it('check if payload is matching the refresh token', async () => {
      const user = await createUser();      
      user.refreshToken = await createRefreshToken({ 
        overrides: { 
          user,
          tokenHash: await createTokenHash({ user, secret: 'invalid_secret', expiresIn: '1d' })
        }
      });
      const [strategy] = await createMocks([ user ]);
      const payload = { sub: user.id, username: user.username, roles: [user.role] };

      await expect(strategy.validate(payload))
        .rejects
        .toThrow(InvalidTokenError);
    });

    it('return plain user data', async () => {
      const hashService = new HashService();
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      user.refreshToken.tokenHash = await hashService.hash('hash');
      const [strategy] = await createMocks([ user ]);
      const payload = { sub: user.id, username: user.username, roles: [user.role] };

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
