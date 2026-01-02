import { UsersController } from '../users.controller';
import { CreateUserDto } from '../dtos/create-user.dto';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { plainToInstance } from 'class-transformer';
import { createMocks } from './utils/controller/create-mocks';

describe(UsersController.name, () => {
  describe(`::${UsersController.prototype.findAll.name} should`, () => {
    it('return all users', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [controller, usersService] = await createMocks([ user ]);

      await expect(controller.findAll()).resolves.toEqual([ user ]);
      expect(usersService.findAll).toHaveBeenCalled();
    })
  });

  describe(`::${UsersController.prototype.find.name} should`, () => {
    it('return user by given id', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [controller, usersService] = await createMocks([ user ]);

      await expect(controller.find(user.id)).resolves.toEqual(user);
      expect(usersService.findById).toHaveBeenCalled();
    })
  });

  describe(`::${UsersController.prototype.me.name} should`, () => {
    it('return user by given id', async () => {
      const user = await createUser();
      user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user }});
      const [controller, usersService] = await createMocks([ user ]);

      await expect(controller.me({ user: { username: user.username, id: user.id, roles: [user.role] }})).resolves.toEqual(user);
      expect(usersService.findById).toHaveBeenCalled();
    })
  });

  describe(`::${UsersController.prototype.create.name} should`, () => {
    it('create and return a new user', async () => {
      const user = await createUser();
      const [controller, usersService] = await createMocks([]);

      const req = { id: user.id, username: user.username, roles: [user.role] }
      await expect(
        controller.create(
          { user: req }, 
          plainToInstance(CreateUserDto, { username: user.username, password: user.unhashedPassword, role: user.role  }))
        )
        .resolves
        .toMatchObject({ username: user.username, role: user.role });
      expect(usersService.tryCreateWithSupervisor).toHaveBeenCalled();
    })
  });
});
