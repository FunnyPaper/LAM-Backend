import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../../src/users/entities/user.entity";
import { App } from "supertest/types";
import { Repository } from "typeorm";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { UsersService } from "src/users/users.service";

export async function getIdByUsername(app: INestApplication<App>, username: string) {
  const service: Repository<UserEntity> = app.get(getRepositoryToken(UserEntity));
  const user = await service.findOne({
    where: {
      username
    }
  });

  return user?.id;
}

export async function createUser(app: INestApplication<App>, dto: CreateUserDto) {
  const service: UsersService = app.get(UsersService);
  const user = await service.tryCreate(dto);

  return user;
}

export async function deleteUser(app: INestApplication<App>, id: string) {
  const service: Repository<UserEntity> = app.get(getRepositoryToken(UserEntity));

  await service.delete(id);
}
