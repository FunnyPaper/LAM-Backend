import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from '../../src/auth/auth.controller';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { setupApp } from '../utils/setup';
import { clearDB } from 'test/utils/database';
import { testTypes } from 'test/utils/testTypes';

describe.each(testTypes())(`${AuthController.name} (e2e) (%s)`, (type) => {
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

  describe('/auth/login (POST)', () => {
    it("should login with valid credentials", async () => {
      const username = process.env.INITIAL_ADMIN_USERNAME;
      const password = process.env.INITIAL_ADMIN_PASSWORD;

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username, password })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    })
  });
});
