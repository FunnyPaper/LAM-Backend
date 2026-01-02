import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UsersController } from '../../src/users/users.controller';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { login } from '../utils/auth';
import { Role } from '../../src/app.roles';
import { setupApp } from 'test/utils/setup';
import { createUser } from 'test/utils/user';
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

  it('should return all users if logged as admin', async () => {
    const username = process.env.INITIAL_ADMIN_USERNAME!;
    const password = process.env.INITIAL_ADMIN_PASSWORD!;

    const response = await login(app, { username, password });
    const getResponse = await request(app.getHttpServer())
      .get('/users')
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send()
      .expect(HttpStatus.OK);

    expect(getResponse.body)
      .toEqual(expect.any(Array))
    
    expect(getResponse.body)
      .toContainEqual(expect.objectContaining({ username, role: Role.ADMIN }));
  })

  it(`should return ${HttpStatus.FORBIDDEN} if logged as user`, async () => {
    const username = "TestUser";
    const password = "TestPassword123@";
    await createUser(app, { username, password, role: Role.USER });

    const response = await login(app, { username, password });
    await request(app.getHttpServer())
      .get('/users')
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send()
      .expect(HttpStatus.FORBIDDEN);
  })
});
