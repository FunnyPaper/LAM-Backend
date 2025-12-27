import { UsersService } from '../users.service';
import { Role } from '../../app.roles';
import { createUser } from 'test/utils/factories/users.factory';
import { InsufficientPrivilegesError } from 'src/auth/errors/insufficient-privileges.error';
import { UsernameTakenError } from '../errors/username-taken.error';
import { createMocks } from './utils/service/create-mocks';

describe(`${UsersService.name} - create`, () => {
  describe(`::${UsersService.prototype.tryCreateWithSupervisor.name} should`, () => {
    it('create user if supervisor is an admin', async () => {
      const [service] = await createMocks([]);
      const admin = await createUser({ overrides: { role: Role.ADMIN }});

      await expect(service.tryCreateWithSupervisor({
        creator: { ...admin, roles: [admin.role] },
        username: "Jack",
        password: "password",
        role: Role.USER
      }))
        .resolves
        .toMatchObject(
          expect.objectContaining({ username: "Jack", role: Role.USER })
        )
    });

    it('throw if creator is not an admin', async () => {
      const [service] = await createMocks([]);
      const nonAdmin = await createUser({ overrides: { role: Role.USER }});

      await expect(service.tryCreateWithSupervisor({
        creator: { ...nonAdmin, roles: [nonAdmin.role] },
        username: "Jack",
        password: "password",
        role: Role.ADMIN
      }))
        .rejects
        .toThrow(InsufficientPrivilegesError)
    });
  });

  describe(`::${UsersService.prototype.tryCreate.name} should`, () => {
    it('create user', async () => {
      const [service] = await createMocks([]);

      await expect(service.tryCreate({
        username: "Jack",
        password: "password",
        role: Role.USER
      }))
        .resolves
        .toMatchObject(
          expect.objectContaining({ username: "Jack", role: Role.USER })
        )
    });

    it('throw if username is taken', async () => {
      const username = 'user';
      const user = await createUser({ overrides: { username }});
      const [service] = await createMocks([ user ]);

      await expect(service.tryCreate({
        username: username,
        password: "password",
        role: Role.USER
      }))
        .rejects
        .toThrow(UsernameTakenError)
    });
  });

  describe(`::${UsersService.prototype.createSuperAdmin.name} should`, () => {
    it('create user with admin role', async () => {
      const [service] = await createMocks([]);

      await expect(service.createSuperAdmin())
        .resolves
        .toMatchObject(
          expect.objectContaining({ username: process.env.INITIAL_ADMIN_USERNAME, role: Role.ADMIN })
        )
    });
  });
});
