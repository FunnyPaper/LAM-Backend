import { TestingModule } from "@nestjs/testing";
import { InitCommand } from "../../src/commands/init.command";
import { UsersService } from "../../src/users/users.service";
import { EntityManager } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { createUser } from "./user";
import { Role } from "src/app.roles";
import { App } from "supertest/types";

export async function initDB(moduleRef: TestingModule) {
  const usersService = moduleRef.get(UsersService);
  await new InitCommand(usersService).run();
}

export async function clearDB(app: INestApplication<App>, type: 'local' | 'remote'): Promise<void> {
  const entityManager = app.get(EntityManager);
  const tableNames = entityManager.connection.entityMetadatas
    .map((entity) => entity.tableName);

  if(type == 'local') {
    await entityManager.query(`PRAGMA foreign_keys = OFF;`);

    for (const tableName of tableNames) {
      await entityManager.query(`DELETE FROM "${tableName}";`);
    }

    await entityManager.query(`PRAGMA foreign_keys = ON;`);
  } else if(type == 'remote') {
    for (const tableName of tableNames) {
      await entityManager.query(`TRUNCATE "${tableName}" RESTART IDENTITY CASCADE;`);
    }
  }

  await createUser(app, { 
    username: process.env.INITIAL_ADMIN_USERNAME!, 
    password: process.env.INITIAL_ADMIN_PASSWORD!, 
    role: Role.ADMIN 
  })
}