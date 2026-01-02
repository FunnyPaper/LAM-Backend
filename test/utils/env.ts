import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateEnvDto } from "src/env/dto/create-env.dto";
import { EnvEntity } from "src/env/entities/env.entity";
import { App } from "supertest/types";
import { Repository } from "typeorm";
import request from 'supertest';

export async function createEnv(app: INestApplication<App>, accessToken: string, userId: string, dto: CreateEnvDto) {
  const repository: Repository<EnvEntity> = app.get(getRepositoryToken(EnvEntity));
  const env = repository.create(dto);
  await repository.save(env);

  return request(app.getHttpServer())
    .post(`/users/${userId}/envs`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(dto);
}

export async function getEnvs(app: INestApplication<App>, userId: string) {
  const repository: Repository<EnvEntity> = app.get(getRepositoryToken(EnvEntity));

  return repository.find({
    where: {
      owner: {
        id: userId
      }
    }
  })
}