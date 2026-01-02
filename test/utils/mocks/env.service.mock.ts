import { CreateEnvDto } from "src/env/dto/create-env.dto";
import { UpdateEnvDto } from "src/env/dto/update-env.dto";
import { EnvService } from "src/env/env.service";
import { FakeEnv } from "../entities/env";
import { createEnv } from "../factories/env.factory";
import { FakeUser } from "../entities/user";

export function createEnvServiceMock(users: FakeUser[]) {
  return {
    create: jest.fn().mockImplementation(async (userId: string, dto: CreateEnvDto): Promise<FakeEnv> => {
      const user = users.find(user => user.id == userId);
      const env = await createEnv({ ...dto, owner: user });

      if(user) {
        user.envs ??= [];
        user.envs.push(env)
      }
      
      return env;
    }),
    update: jest.fn().mockImplementation((userId: string, envId: string, dto: UpdateEnvDto): Promise<FakeEnv> => {
      const user = users.find(user => user.id == userId);
      const env = user?.envs?.find(env => env.id == envId);

      if(env && user) {
        return Promise.resolve(Object.assign(env, dto));
      }

      return Promise.resolve(env as FakeEnv);
    }),
    tryFindAll: jest.fn().mockImplementation((userId: string): Promise<FakeEnv[]> => {
      const user = users.find(user => user.id == userId);
      return Promise.resolve(user?.envs as FakeEnv[]);
    }),
    findById: jest.fn().mockImplementation((userId: string, envId: string): Promise<FakeEnv> => {
      const user = users.find(user => user.id == userId);
      const env = user?.envs?.find(env => env.id == envId);
      return Promise.resolve(env as FakeEnv);
    }),
    remove: jest.fn().mockImplementation((userId: string, envId: string): Promise<void> => {
      const user = users.find(user => user.id == userId);
      const index = user?.envs?.findIndex(env => env.id == envId);

      if(index != null && index >= 0) {
        user?.envs?.splice(index, 1);
      }

      return Promise.resolve();
    })
  } satisfies Partial<EnvService>
}