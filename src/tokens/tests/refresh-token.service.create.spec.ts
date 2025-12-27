import { UserEntity } from 'src/users/entities/user.entity';
import { RefreshTokenService } from '../refresh-token.service';
import { createMocks } from './utils/service/create-mocks';

describe(RefreshTokenService.name, () => {
  describe(`::${RefreshTokenService.prototype.create.name} should`, () => {
    it('save new refresh token for given user', async () => {
      const [service, refreshTokenRepo] = await createMocks([]);
      await service.create({ hash: 'hash', user: new UserEntity(), expires: new Date() });

      expect(refreshTokenRepo.create).toHaveBeenCalled();
      expect(refreshTokenRepo.save).toHaveBeenCalled();
    });
  });
});
