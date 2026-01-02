import { EnvService } from '../env.service';
import { createMocks } from './utils/service/create-mocks';
import { createUser } from 'test/utils/factories/users.factory';
import { createEnv } from 'test/utils/factories/env.factory';
import { CreateEnvDto } from '../dto/create-env.dto';
import { UpdateEnvDto } from '../dto/update-env.dto';
import { EnvNotFoundError } from '../errors/env-not-found.error';

describe(EnvService.name, () => {
  describe(`::${EnvService.prototype.create.name} should`, () => {
    it("create env", async () => {
      const user = await createUser();
      const [service, envRepository] = await createMocks([]);

      const dto: CreateEnvDto = {
        name: 'name',
        description: "description",
        data: {
          field: "data"
        }
      }

      await service.create(user.id, dto);
      expect(envRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(dto)
      );
    });
  });

  describe(`::${EnvService.prototype.tryFindAll.name} should`, () => {
    it("return all user's envs", async () => {
      const user = await createUser();
      const env = await createEnv();
      user.envs = [ env ];
      env.owner = user;
      const [service] = await createMocks([ user ]);

      await expect(service.tryFindAll(user.id))
        .resolves
        .toMatchObject([ env ])
    });
  });

  describe(`::${EnvService.prototype.findById.name} should`, () => {
    it("return user's specific env", async () => {
      const user = await createUser();
      const env = await createEnv();
      user.envs = [ env ];
      const [service] = await createMocks([ user ]);

      await expect(service.findById(user.id, env.id))
        .resolves
        .toBe(env)
    });

    it("throw if env has not been found", async () => {
      const user = await createUser();
      const env = await createEnv();
      user.envs = [];
      const [service] = await createMocks([ user ]);

      await expect(service.findById(user.id, env.id))
        .rejects
        .toThrow(EnvNotFoundError)
    })
  });

  describe(`::${EnvService.prototype.remove.name} should`, () => {
    it("remove user's env", async () => {
      const user = await createUser();
      const env = await createEnv();
      user.envs = [ env ];
      const [service, envRepository] = await createMocks([ user ]);

      await service.remove(user.id, env.id);

      expect(envRepository.delete).toHaveBeenCalledWith(env.id);
    });
  });

  describe(`::${EnvService.prototype.update.name} should`, () => {
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

      const [service] = await createMocks([ user ]);
      await expect(service.update(user.id, env.id, dto))
        .resolves
        .toMatchObject(dto)
    });
  });
});
