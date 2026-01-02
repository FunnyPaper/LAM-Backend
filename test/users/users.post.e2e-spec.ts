import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UsersController } from '../../src/users/users.controller';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { login, registerAndLogin } from '../utils/auth';
import { Role } from '../../src/app.roles';
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

  it.each([
    Role.USER, Role.ADMIN
  ])('should create user with role %s if logged as admin', async (role) => {
    const username = process.env.INITIAL_ADMIN_USERNAME!;
    const password = process.env.INITIAL_ADMIN_PASSWORD!;
    const response = await login(app, { username, password });
    const newUsername = "TestUser0";
    const newPassword = "TestPassword123@";
    const postResponse = await request(app.getHttpServer())
      .post('/users')
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send({ username: newUsername, password: newPassword, role })
      .expect(HttpStatus.CREATED);

    expect(postResponse.body).toMatchObject({
      username: newUsername,
      role,
    });
  })

  it.each([
    Role.USER, Role.ADMIN
  ])(`should return ${HttpStatus.FORBIDDEN} if logged as user`, async (role) => {
    const username = "TestUser1";
    const password = "TestPassword1@";

    const userResponse = await registerAndLogin(app, { 
      username,
      password
    });

    await request(app.getHttpServer())
      .post('/users')
      .set("Authorization", `Bearer ${userResponse.body.accessToken}`)
      .send({ username, password, role })
      .expect(HttpStatus.FORBIDDEN);
  })
});
