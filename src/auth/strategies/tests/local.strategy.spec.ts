import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from '../local.strategy';
import { AuthService } from '../../auth.service';
import { createAuthServiceMock } from 'test/utils/mocks/auth.service.mock';
import { FakeUser } from 'test/utils/entities/user';
import { createUser } from 'test/utils/factories/users.factory';

async function createMocks(users: FakeUser[]) {
  const authServiceMock = createAuthServiceMock(users);
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      LocalStrategy,
      { provide: AuthService, useValue: authServiceMock },
    ],
  }).compile();

  return [
    module.get<LocalStrategy>(LocalStrategy), 
    authServiceMock
  ] as const;
}

describe(LocalStrategy.name, () => {
  describe(`::${LocalStrategy.prototype.validate.name} should`, () => {
    it('check is user exists', async () => {
      const user = await createUser();
      const [strategy] = await createMocks([]);
      const payload = { username: user.username, password: user.unhashedPassword };

      await expect(strategy.validate(payload.username, payload.password))
        .resolves
        .not
        .toBeDefined();
    });

    it('return plain user data', async () => {
      const user = await createUser();
      const [strategy] = await createMocks([ user ]);
      const payload = { username: user.username, password: user.unhashedPassword };

      await expect(strategy.validate(payload.username, payload.password))
        .resolves
        .toMatchObject({
          id: user.id,
          username: payload.username,
          roles: [user.role]
        })
    })
  })
});
