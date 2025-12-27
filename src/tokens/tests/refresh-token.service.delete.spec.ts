import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { RefreshTokenService } from '../refresh-token.service';
import { createMocks } from './utils/service/create-mocks';
import { faker } from '@faker-js/faker';

describe(RefreshTokenService.name, () => {
  describe(`::${RefreshTokenService.prototype.removeById.name} should`, () => {
    it('remove refresh token with given id', async () => {
      const [service, refreshTokenRepo] = await createMocks([]);
      await service.removeById('1');

      expect(refreshTokenRepo.delete).toHaveBeenCalled();
    });
  })

  describe(`::${RefreshTokenService.prototype.removeExpired.name} should`, () => {
    it('remove expired refresh tokens', async () => {
      const expiredTokens = [
        await createRefreshToken({ overrides: { expiresAt: faker.date.past() }}),
        await createRefreshToken({ overrides: { expiresAt: faker.date.past() }})
      ]
      const validTokens = [
        await createRefreshToken(),
        await createRefreshToken()
      ]
      const [service, refreshTokenRepo] = await createMocks([...expiredTokens, ...validTokens]);

      await service.removeExpired();

      expect(refreshTokenRepo.find).toHaveBeenCalled();
      expect(refreshTokenRepo.delete).toHaveBeenCalled();
    });
  })
});
