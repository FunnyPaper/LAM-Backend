import { EnvEntity } from "src/env/entities/env.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { FakeEnv } from "../entities/env";

export function createEnvRepositoryMock(envs: FakeEnv[]) {
  return {
    create: jest.fn(),
    save: jest.fn().mockImplementation((dto: Partial<FakeEnv>): Promise<FakeEnv> => {
      const env = envs.find(env => env.id == dto.id) || {};
      return Promise.resolve(Object.assign(env, dto) as FakeEnv);
    }),
    find: jest.fn().mockImplementation((options?: FindManyOptions<FakeEnv>): Promise<FakeEnv[]> => {
      const { where } = options || {}
      if(where && !(where instanceof Array)) {
        const { owner = {} } = where;

        return Promise.resolve(envs?.filter(env => env.owner?.id == owner['id']))
      }

      return Promise.resolve(envs);
    }),
    findOne: jest.fn().mockImplementation((options: FindOneOptions<FakeEnv>): Promise<FakeEnv | null> => {
      const { where } = options || {}
      if(where && !(where instanceof Array)) {
        const { id } = where;

        return Promise.resolve(envs?.find(env => env.id == id) ?? null)
      }

      return Promise.resolve(envs[0]);
    }),
    delete: jest.fn(),
  } satisfies Partial<Repository<EnvEntity>>
}