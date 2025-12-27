import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from '../../src/auth/auth.controller';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { login } from '../utils/auth';
import { setupApp } from '../utils/setup-app';
import { clearDB } from 'test/utils/database';
import { testTypes } from 'test/utils/testTypes';

describe.each(testTypes())(`${AuthController.name} (e2e) (%s)`, (type) => {
  let app: INestApplication<App>;
  let container: StartedPostgreSqlContainer | null;

  beforeAll(async () => {
    [app, container] = await setupApp(type);
  }, 60000);

  afterAll(async () => {
    await app.close();
    await container?.stop();
  });
    
  afterEach(async () => {
    await clearDB(app, type);
  })

  it('/auth/logout (POST)', async () => {
    const username = process.env.INITIAL_ADMIN_USERNAME!;
    const password = process.env.INITIAL_ADMIN_PASSWORD!;

    await request(app.getHttpServer())
      .post('/auth/logout')
      .send()
      .expect(HttpStatus.UNAUTHORIZED);

    const response = await login(app, { username, password });

    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .send()
      .expect(HttpStatus.CREATED);
      
    expect(res.body).toMatchObject({ message: 'Token revoked' });
  });
});
