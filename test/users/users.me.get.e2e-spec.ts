import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UsersController } from '../../src/users/users.controller';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { login } from '../utils/auth';
import { Role } from '../../src/app.roles';
import { createUser, deleteUser } from '../utils/user';
import { setupApp } from 'test/utils/setup';
import { clearDB } from 'test/utils/database';
import { testTypes } from 'test/utils/testTypes';

describe.each(testTypes())(`${UsersController.name} (e2e) %s`, (type) => {
  let app: INestApplication<App>;
  let container: StartedPostgreSqlContainer | null;

  beforeAll(async () => {
    [app, container] = await setupApp(type);
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  afterEach(async () => {
    if(app) {
      await clearDB(app, type);
    }
  })

  beforeEach(() => {
    expect(app).toBeDefined();
  })

  describe("/users/me (GET)", () => {
    const mockRoles = [ Role.ADMIN, Role.USER ];
    it.each(mockRoles)(`return self (%s)`, async (role) => {
      const username = `TestUser${mockRoles.indexOf(role)}`;
      const password = "TestUser123@";
      
      const user = await createUser(app, { username, password, role });
      const response = await login(app, { username, password });
      
      const getResponse = await request(app.getHttpServer())
        .get(`/users/me`)
        .set("Authorization", `Bearer ${response.body.accessToken}`)
        .send()
        .expect(HttpStatus.OK);

      expect(getResponse.body)
        .toMatchObject({ username: user.username, role: user.role })
    })

    it.each(mockRoles)(`return ${HttpStatus.NOT_FOUND} when user was not found (%s)`, async (role) => {
      const username = `TestUser${mockRoles.indexOf(role)}`;
      const password = "TestUser123@";

      const user = await createUser(app, { username, password, role });
      const response = await login(app, { username, password });
      
      await deleteUser(app, user.id);

      await request(app.getHttpServer())
        .get(`/users/me`)
        .set("Authorization", `Bearer ${response.body.accessToken}`)
        .send()
        .expect(HttpStatus.NOT_FOUND);
    })
  })
});
