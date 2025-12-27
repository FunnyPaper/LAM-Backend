import { UsersService } from '../users.service';
import { Role } from '../../app.roles';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { createMocks } from './utils/service/create-mocks';

describe(`${UsersService.name} - query`, () => {
  describe(`::${UsersService.prototype.findAll.name} should`, () => {
    it('return all users', async () => {
      const users = [await createUser()];
      const [service, usersService] = await createMocks(users);

      await expect(service.findAll())
        .resolves
        .toEqual(users);
      expect(usersService.find).toHaveBeenCalled();
    });
  });

  describe(`::${UsersService.prototype.findById.name} should`, () => {
    it('return user by id', async () => {
      const user = await createUser();
      const [service] = await createMocks([ user ]);
      
      await expect(service.findById(user.id))
        .resolves
        .toEqual(user);
    });

    it('throw if user is not found', async () => {
      const user = await createUser();
      const [service] = await createMocks([]);
      
      await expect(service.findById(user.id))
        .rejects
        .toThrow(UserNotFoundError)
    });
  });

  describe(`::${UsersService.prototype.tryFindById.name} should`, () => {
    it('Return null if user is not found', async () => {
      const user = await createUser();
      const [service] = await createMocks([]);
      
      await expect(service.tryFindById(user.id))
        .resolves
        .toBeNull()
    });

    it('return user by id', async () => {
      const user = await createUser();
      const [service] = await createMocks([ user ]);
      
      await expect(service.tryFindById(user.id))
        .resolves
        .toEqual(user);
    });
  });

  describe(`::${UsersService.prototype.tryFindByIdWithRefreshToken.name} should`, () => {
    it('return user with refresh token', async () => {
      const user = await createUser();
      const [service] = await createMocks([ user ]);

      await expect(service.tryFindByIdWithRefreshToken(user.id))
        .resolves
        .toMatchObject(user)
    });
  });

  describe(`::${UsersService.prototype.tryFindOneByUsername.name} should`, () => {
    it('return user by given username', async () => {
      const user = await createUser();
      const [service] = await createMocks([ user ]);

      await expect(service.tryFindOneByUsername(user.username))
        .resolves
        .toEqual(user)
    });
  });

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
  });

  describe(`::${UsersService.prototype.tryFindAdmin.name} should`, () => {
    it('find any admin', async () => {
      const user = await createUser({ overrides: { role: Role.ADMIN }});
      const [service] = await createMocks([ user ]);

      await expect(service.tryFindAdmin())
        .resolves
        .toEqual(user);
    });
  });

  describe(`::${UsersService.prototype.clearRefreshToken.name} should`, () => {
    it('clear refresh token for the given user', async () => {
      const user = await createUser({ overrides: { role: Role.ADMIN }});
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [service] = await createMocks([ user ]);

      await service.clearRefreshToken(user.id);
      expect(user.refreshToken).toBeNull();
    });
  });
});
