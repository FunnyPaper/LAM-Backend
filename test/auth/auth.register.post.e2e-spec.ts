import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from '../../src/auth/auth.controller';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { login, register } from '../utils/auth';
import { setupApp } from '../utils/setup';
import { faker } from '@faker-js/faker';
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
  }, 30000)

  beforeEach(() => {
    expect(app).toBeDefined();
  })

  describe("/auth/register (POST)", () => {
    it('should create a new user', async () => {
      const username = "UserTest0";
      const password = "TestPassword1@";

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username, password })
        .expect(HttpStatus.CREATED);

      const response = await login(app, { username, password });

      expect(response.body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it(`should return ${HttpStatus.CONFLICT} if username is taken`, async () => {
      const username = "UserTest";
      const password = "TestPassword1@";

      await register(app, { username, password })
        .expect(HttpStatus.CREATED);
      
      await register(app, { username, password })
        .expect(HttpStatus.CONFLICT);
    });

    it.each([
      ["Username", "Us1@"], // min-length  
      ["Username", "User1@" + faker.string.alphanumeric({ length: 123 })], // max-length  
      ["Username", "User11"],  // symbols
      ["Username", "user1@"],  // uppercase
      ["Username", "User@@"],  // numbers
      ["Username", "USER1@"],  // lowercase
      ["User", "User1@"],  // min-length
      ["Username" + faker.string.alphanumeric({ length: 25 }), "User1@"],  // max-length
    ])(`should return ${HttpStatus.BAD_REQUEST} with invalid credentials (%s - %s)`, async (username, password) => {
      await register(app, { username, password })
        .expect(HttpStatus.BAD_REQUEST);
    })
  })
});
