import { AuthService } from '../auth.service';
import { UserNotFoundError } from 'src/users/errors/user-not-found.error';
import { TokenRevokedError } from 'src/tokens/errors/token-revoked.error';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { faker } from '@faker-js/faker';
import { TokenExpiredError } from 'src/tokens/errors/token-expired.error';
import { createMocks } from './utils/service/create-mocks';

describe(`${AuthService.name} - refresh-token`, () => {
  describe(`::${AuthService.prototype.refresh.name} should`, () => {
    it('check that user exists', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service] = await createMocks([]);

      await expect(service.refresh(user.id))
        .rejects
        .toThrow(UserNotFoundError);
    });

    it('reject user without refresh token', async () => {
      const user = await createUser();
      const [service] = await createMocks([ user ]);

      await expect(service.refresh(user.id))
        .rejects
        .toThrow(TokenRevokedError);
    });

    it('reject expired refresh token', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ 
        linkRelations: true, 
        overrides: { 
          user,
          expiresAt: faker.date.past()
        }
      });
      const [service] = await createMocks([ user ]);

      await expect(service.refresh(user.id))
        .rejects
        .toThrow(TokenExpiredError);
    });

    it('create new access and refresh tokens', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service] = await createMocks([ user ]);

      await expect(service.refresh(user.id))
        .resolves  
        .toMatchObject({
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        });
    });
  });
});
