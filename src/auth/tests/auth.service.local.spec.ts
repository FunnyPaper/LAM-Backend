import { AuthService } from '../auth.service';
import { CredentialMismatchError } from '../errors/credential-mismatch.error';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { createMocks } from './utils/service/create-mocks';

describe(`${AuthService.name} - local`, () => {
  describe(`::${AuthService.prototype.validateLocalUser.name} should`, () => {
    it('check that user exists', async () => {
      const username = 'Adam';
      const password = 'valid_password';
      const invalidUsername = 'invalid_username'
      const user = await createUser({ 
        overrides: {
          username: username,
          password: password
        }
      });
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service] = await createMocks([ user ]);

      await expect(service.validateLocalUser({ username: invalidUsername, password: password }))
        .rejects
        .toThrow(CredentialMismatchError);
    });

    it('check that credentials are correct', async () => {
      const username = 'Adam';
      const password = 'valid_password';
      const invalidPassword = 'invalid_password'
      const user = await createUser({ 
        overrides: {
          username: username,
          password: password
        }
      });
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service] = await createMocks([ user ]);

      await expect(service.validateLocalUser({ username: username, password: invalidPassword }))
        .rejects
        .toThrow(CredentialMismatchError);
    });

    it('return id, username and role associated with the user', async () => {
      const user = await createUser({ 
        overrides: {
          username: 'Adam',
          password: 'valid_password'
        }
      });
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service] = await createMocks([ user ]);
      const result = await service.validateLocalUser({ username: user.username, password: user.unhashedPassword });

      expect(result)
        .toMatchObject({
          id: user.id,
          username: user.username,
          roles: [user.role]
        });
    });
  });
});
