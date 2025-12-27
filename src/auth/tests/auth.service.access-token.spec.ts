import { AuthService } from '../auth.service';
import { Role } from '../../app.roles';
import { UserNotFoundError } from 'src/users/errors/user-not-found.error';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { createMocks } from './utils/service/create-mocks';

describe(`${AuthService.name} - access-token`, () => {
  describe(`::${AuthService.prototype.login.name} should`, () => {
    it('check that user exists', async () => {
      const user = await createUser();
      const [service] = await createMocks([]);

      await expect(service.login({ username: user.username, id: user.id, roles: [user.role] }))
        .rejects
        .toThrow(UserNotFoundError);
    });

    it('create access and refresh tokens', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service] = await createMocks([ user ]);
      const signAccessTokenSpy = jest.spyOn(service, 'signAccessToken');
      const signRefreshTokenSpy = jest.spyOn(service, 'signRefreshToken');
      const data = { 
        username: user.username, 
        id: user.id, 
        roles: [Role.USER] 
      }

      await service.login(data);

      expect(signAccessTokenSpy).toHaveBeenCalledWith(data);
      expect(signRefreshTokenSpy).toHaveBeenCalledWith(data);
    });

    it('create refresh token entity instance', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service, ,, refreshTokenService] = await createMocks([ user ]);

      await service.login({ 
        username: user.username, 
        id: user.id, 
        roles: [Role.USER] 
      });

      expect(refreshTokenService.create).toHaveBeenCalled();
    });

    it('return access and refresh tokens', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service] = await createMocks([ user ]);

      const tokens = await service.login({ 
        username: user.username, 
        id: user.id, 
        roles: [Role.USER] 
      });

      expect(tokens).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      });
    });
  });

  describe(`::${AuthService.prototype.logout.name} should`, () => {
    it('remove user\'s refresh token', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service, usersService] = await createMocks([ user ]);

      await service.logout(user.id);
      expect(usersService.clearRefreshToken)
        .toHaveBeenCalledWith(user.id);
    });
  });
});
