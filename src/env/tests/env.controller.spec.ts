import { createUser } from 'test/utils/factories/users.factory';
import { EnvController } from '../env.controller';
import { createMocks } from './utils/controller/create-mocks';
import { createEnv } from 'test/utils/factories/env.factory';
import { CreateEnvDto } from '../dto/create-env.dto';
import { UpdateEnvDto } from '../dto/update-env.dto';

describe(EnvController.name, () => {
  describe(`::${EnvController.prototype.create.name} should`, () => {
    it("create env", async () => {
      const user = await createUser();
      user.envs = [];
      const [controller] = await createMocks([ user ]);

      const dto: CreateEnvDto = {
        name: 'name',
        description: "description",
        data: {
          field: "data"
        }
      }

      const result = await controller.create(user.id, dto);
      expect(result).toMatchObject(dto);

      expect(user.envs).toContain(result);
    });
  });

  describe(`::${EnvController.prototype.findAll.name} should`, () => {
    it("return all user's envs", async () => {
      const user = await createUser();
      const env = await createEnv();
      user.envs = [ env ];
      const [controller] = await createMocks([ user ]);

      await expect(controller.findAll(user.id))
        .resolves
        .toMatchObject([ env ])
    });
  });

  describe(`::${EnvController.prototype.findOne.name} should`, () => {
    it("return user's specific env", async () => {
      const user = await createUser();
      const env = await createEnv();
      user.envs = [ env ];
      const [controller] = await createMocks([ user ]);

      await expect(controller.findOne(user.id, env.id))
        .resolves
        .toBe(env)
    });
  });

  describe(`::${EnvController.prototype.remove.name} should`, () => {
    it("remove user's env", async () => {
      const user = await createUser();
      const env = await createEnv();
      user.envs = [ env ];
      const [controller] = await createMocks([ user ]);

      await controller.remove(user.id, env.id);

      expect(user.envs).toMatchObject([])
    });
  });

  describe(`::${EnvController.prototype.update.name} should`, () => {
    it("update user's env", async () => {
      const user = await createUser();
      const env = await createEnv();
      user.envs = [ env ];

      const dto: UpdateEnvDto = {
        name: 'name',
        description: "description",
        data: {
          field: "data"
        }
      }

      const [controller] = await createMocks([ user ]);
      await expect(controller.update(user.id, env.id, dto))
        .resolves
        .toMatchObject(dto)
    });
  });
});
