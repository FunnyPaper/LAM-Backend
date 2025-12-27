import { UsersService } from '../users.service';
import { Role } from '../../app.roles';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { createMocks } from './utils/service/create-mocks';
import { faker } from '@faker-js/faker';

describe(`${UsersService.name} - token`, () => {
  describe(`::${UsersService.prototype.clearRefreshToken.name} should`, () => {
    it('clear refresh token for the given user', async () => {
      const user = await createUser({ overrides: { role: Role.ADMIN }});
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service] = await createMocks([ user ]);

      await service.clearRefreshToken(user.id);
      expect(user.refreshToken).toBeNull();
    });
  });

  describe(`::${UsersService.prototype.clearExpiredRefreshTokens.name} should`, () => {
    it('clear refresh token for the given user', async () => {
      const user = await createUser({ overrides: { role: Role.ADMIN }});
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user, expiresAt: faker.date.past() }});
      const [service] = await createMocks([ user ]);

      await expect(service.clearExpiredRefreshTokens())
        .resolves
        .toEqual(1);
    });
  });
});
