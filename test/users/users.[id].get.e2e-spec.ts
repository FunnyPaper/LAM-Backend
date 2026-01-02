import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UsersController } from '../../src/users/users.controller';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { login } from '../utils/auth';
import { Role } from '../../src/app.roles';
import { createUser, deleteUser, getIdByUsername } from '../utils/user';
import { setupApp } from 'test/utils/setup';
import { faker } from '@faker-js/faker';
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

  it('return user by given id', async () => {
    const username = process.env.INITIAL_ADMIN_USERNAME!;
    const password = process.env.INITIAL_ADMIN_PASSWORD!;
    const id = await getIdByUsername(app, username);
    const user = await createUser(app, { username: "TestUser0", password: "TestUser123@", role: Role.USER });
    const response = await login(app, { username, password });
    
    // Self
    let getResponse = await request(app.getHttpServer())
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send()
      .expect(200);

    expect(getResponse.body)
      .toMatchObject({ username, role: Role.ADMIN })

    // Other
    getResponse = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send()
      .expect(200);

    expect(getResponse.body)
      .toMatchObject({ username: user.username, role: user.role })
  })

  it(`return ${HttpStatus.FORBIDDEN} when trying to get user with higher role`, async () => {
    const username = process.env.INITIAL_ADMIN_USERNAME!;
    const id = await getIdByUsername(app, username);

    await createUser(app, { username: "TestUser1", password: "TestUser123@", role: Role.USER });
    const response = await login(app, { username: "TestUser1", password: "TestUser123@" });
    await request(app.getHttpServer())
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send()
      .expect(HttpStatus.FORBIDDEN);
  })

  it(`return ${HttpStatus.NOT_FOUND} when user was not found`, async () => {
    const user = await createUser(app, { username: "TestUser2", password: "TestUser123@", role: Role.USER });
    const response = await login(app, { username: "TestUser2", password: "TestUser123@" });
    await deleteUser(app, user.id);

    await request(app.getHttpServer())
      .get(`/users/${faker.string.uuid()}`)
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send()
      .expect(HttpStatus.NOT_FOUND);
  })

  it(`return ${HttpStatus.FORBIDDEN} when user tries to access other users`, async () => {
    await createUser(app, { username: "TestUser3", password: "TestUser123@", role: Role.USER });
    const user = await createUser(app, { username: "TestUser4", password: "TestUser123@", role: Role.USER });
    const response = await login(app, { username: "TestUser3", password: "TestUser123@" });
    await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send()
      .expect(HttpStatus.FORBIDDEN);
  })
});
