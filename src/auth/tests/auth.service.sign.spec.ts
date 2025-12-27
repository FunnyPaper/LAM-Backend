import { AuthService } from '../auth.service';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { createMocks } from './utils/service/create-mocks';

describe(`${AuthService.name} - sign`, () => {
  describe(`::${AuthService.prototype.signRefreshToken.name} should`, () => {
    it('sign refresh token', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service, , jwtService] = await createMocks([ user ]);

      await service.signRefreshToken({ ...user, roles: [user.role] });
      expect(jwtService.signAsync).toHaveBeenCalled();
    });
  });

  describe(`::${AuthService.prototype.signAccessToken.name} should`, () => {
    it('sign access token', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service, , jwtService] = await createMocks([ user ]);

      await service.signAccessToken({ ...user, roles: [user.role] });
      expect(jwtService.signAsync).toHaveBeenCalled();
    });
  })
});
