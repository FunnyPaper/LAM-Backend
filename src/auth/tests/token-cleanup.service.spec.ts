import { TokenCleanupService } from '../token-cleanup.service';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { faker } from '@faker-js/faker';
import { createMocks } from './utils/cleanup-service/create-mocks';

describe(TokenCleanupService.name, () => {
  describe(`::${TokenCleanupService.prototype.cleanExpiredTokens.name} should`, () => {
    it('print message if anything got cleared', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ 
        linkRelations: true, 
        overrides: { 
          user,
          expiresAt: faker.date.past()
        }
      });
      const [service] = await createMocks([ user ]);

      // Tests should not really touch anything that is not part of the public api
      // This time however it is more to check if the logger is involved at all during operation
      const spy = jest.spyOn((service as any).logger, 'log');
      await service.cleanExpiredTokens();

      expect(spy).toHaveBeenCalled();
    })
  })
});
