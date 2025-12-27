import { AuthController } from '../auth.controller';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { Role } from 'src/app.roles';
import { createMocks } from './utils/controller/create-mocks';

describe(AuthController.name, () => {
  describe(`::${AuthController.prototype.login.name} should`, () => {
    it('return pair of tokens', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [controller] = await createMocks([ user ]);
      const req = { user: { username: user.username, id: user.id, roles: [user.role] }};

      await expect(controller.login(req))
        .resolves
        .toEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        });
    });
  });
  describe(`::${AuthController.prototype.logout.name} should`, () => {
    it('return message upon successful logout', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [controller] = await createMocks([ user ]);
      const req = { user: { username: user.username, id: user.id, roles: [user.role] }};

      await expect(controller.logout(req))
        .resolves
        .toEqual({ message: expect.any(String) });
    })
  });
  describe(`::${AuthController.prototype.refresh.name} should`, () => {
    it('return new pair of tokens', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [controller] = await createMocks([ user ]);
      const req = { user: { username: user.username, id: user.id, roles: [user.role] }};

      await expect(controller.refresh(req))
        .resolves
        .toEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        });
    })
  });
  describe(`::${AuthController.prototype.register.name} should`, () => {
    it('create and return a new user', async () => {
      const user = await createUser({ overrides: { role: Role.USER }});
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [controller] = await createMocks([]);
      const userDto = { username: user.username, password: user.unhashedPassword, role: user.role }

      await expect(controller.register(userDto))
        .resolves
        .toMatchObject({ username: userDto.username, role: userDto.role });
    });
  });
});
