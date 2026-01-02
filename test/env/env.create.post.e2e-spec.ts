import { HttpStatus, INestApplication } from "@nestjs/common";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { EnvController } from "src/env/env.controller";
import { App } from "supertest/types";
import { clearDB } from "test/utils/database";
import { setupApp } from "test/utils/setup";
import { testTypes } from "test/utils/testTypes";
import request from 'supertest';
import { createUser, deleteUser } from "test/utils/user";
import { Role } from "src/app.roles";
import { CreateEnvDto } from "src/env/dto/create-env.dto";
import { login } from "test/utils/auth";
import { faker } from "@faker-js/faker";

describe.each(testTypes())(`${EnvController.name} (e2e) (%s)`, (type) => {
  describe('/users/:userId/envs (POST)', () => {
    let app: INestApplication<App>;
    let container: StartedPostgreSqlContainer | null;

    beforeAll(async () => {
      [app, container] = await setupApp(type);
    }, 60000);

    afterAll(async () => {
      await app?.close();
      await container?.stop();
    });

    beforeEach(() => {
      expect(app).toBeDefined();
    })

    afterEach(async () => {
      if(app) {
        await clearDB(app, type);
      }
    })

    it(`should return ${HttpStatus.UNAUTHORIZED} if not authorized`, async () => {
      const createDto: CreateEnvDto = {
        name: "TestEnv",
        description: "TestEnvDescription",
        data: {
          testField: "testField"
        }
      }

      await request(app.getHttpServer())
        .post(`/users/${faker.string.uuid()}/envs`)
        .send(createDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it(`should return ${HttpStatus.NOT_FOUND} if user not found`, async () => {
      const username = "TestUser1";
      const password = "TestPassword123@"
      
      const user = await createUser(app, {
        username,
        password,
        role: Role.USER
      });

      const loginResponse = await login(app, {
        username,
        password
      });

      // Simulate invalid token - user already deleted
      await deleteUser(app, user.id);

      const createDto: CreateEnvDto = {
        name: "TestEnv",
        description: "TestEnvDescription",
        data: {
          testField: "testField"
        }
      }

      await request(app.getHttpServer())
        .post(`/users/${user.id}/envs`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send(createDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it(`should return ${HttpStatus.FORBIDDEN} if user tries to create env for other user`, async () => {
      const username = "TestUser2";
      const password = "TestPassword123@"
      const otherUsername = "OtherTestUser";
      const otherPassword = "TestPassword123@";
      
      await createUser(app, {
        username,
        password,
        role: Role.USER
      });

      const otherUser = await createUser(app, { 
        username: otherUsername, 
        password: otherPassword,
        role: Role.USER 
      })

      const loginResponse = await login(app, {
        username,
        password
      });

      const createDto: CreateEnvDto = {
        name: "TestEnv",
        description: "TestEnvDescription",
        data: {
          testField: "testField"
        }
      }

      await request(app.getHttpServer())
        .post(`/users/${otherUser.id}/envs`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send(createDto)
        .expect(HttpStatus.FORBIDDEN);
    });

    const mockInvalidDtos: CreateEnvDto[] = [
      { name: "", description: "a", data: {} },
      { name: "a", description: "", data: {} },
      { name: faker.string.alphanumeric({ length: 33 }), description: "a" },
      { name: "a", description: faker.string.alphanumeric({ length: 1025 }) },
      {} as CreateEnvDto
    ]
    it.each(mockInvalidDtos)(`should return ${HttpStatus.BAD_REQUEST} if validation constraint are not met`, async (dto) => {
      const username = `TestUser${mockInvalidDtos.indexOf(dto)}`;
      const password = "TestPassword123@";

      const user = await createUser(app, { 
        username, 
        password, 
        role: Role.USER 
      });

      const loginResponse = await login(app, { username, password });

      await request(app.getHttpServer())
        .post(`/users/${user.id}/envs`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    const mockRoles = [ Role.USER, Role.ADMIN ]
    it.each(mockRoles)("should create env for %s if done by admin", async (role) => {
      const username = `TestAdmin${mockRoles.indexOf(role)}`;
      const password = "TestPassword123@"
      const otherUsername = `OtherTestUser${mockRoles.indexOf(role)}`;
      const otherPassword = "TestPassword123@";
      
      await createUser(app, {
        username,
        password,
        role: Role.ADMIN
      });

      const otherUser = await createUser(app, { 
        username: otherUsername, 
        password: otherPassword,
        role: role
      })

      const loginResponse = await login(app, {
        username,
        password
      });

      const createDto: CreateEnvDto = {
        name: "TestEnv",
        description: "TestEnvDescription",
        data: {
          testField: "testField"
        }
      }

      const response = await request(app.getHttpServer())
        .post(`/users/${otherUser.id}/envs`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send(createDto)
        .expect(HttpStatus.CREATED);

      expect(response.body)
        .toEqual(expect.objectContaining(createDto));
    })

    const mockValidDtos = [
      { name: "a", description: "a", data: {} },
      { name: "a", description: "a" },
      { name: "a", description: "a", data: { field: 10 } },
      { name: faker.string.alphanumeric({ length: 32 }), description: faker.string.alphanumeric({ length: 1024 }) },
      { name: faker.string.alphanumeric({ length: 16 }), description: faker.string.alphanumeric({ length: 512 }) },
    ]
    it.each(mockValidDtos)("should create env for the user", async (dto) => {
      const username = `TestUser${mockValidDtos.indexOf(dto)}`;
      const password = "TestPassword123@";

      const user = await createUser(app, { 
        username, 
        password, 
        role: Role.USER 
      });

      const loginResponse = await login(app, { username, password });

      const response = await request(app.getHttpServer())
        .post(`/users/${user.id}/envs`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send(dto)
        .expect(HttpStatus.CREATED);

      expect(response.body)
        .toEqual(expect.objectContaining(dto));
    });
  });
});
