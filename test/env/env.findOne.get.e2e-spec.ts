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
import { login } from "test/utils/auth";
import { faker } from "@faker-js/faker";
import { createEnv, getEnvs } from "test/utils/env";

describe.each(testTypes())(`${EnvController.name} (e2e) (%s)`, (type) => {
  describe('/users/:userId/envs/:envId (GET)', () => {
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
    
    it(`should return ${HttpStatus.UNAUTHORIZED} if not authorized`, async () => {
      await request(app.getHttpServer())
        .get(`/users/${faker.string.uuid()}/envs/${faker.string.uuid()}`)
        .send()
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

      const env = await createEnv(app, loginResponse.body.accessToken as string, user.id, { name: "TestEnv" });

      // Simulate invalid token - user already deleted
      await deleteUser(app, user.id);

      await request(app.getHttpServer())
        .get(`/users/${user.id}/envs/${env.body.id}`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send()
        .expect(HttpStatus.NOT_FOUND);
    });

    it(`should return ${HttpStatus.FORBIDDEN} if user tries to query env of other user`, async () => {
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

      const env = await createEnv(app, loginResponse.body.accessToken as string, otherUser.id, { name: "TestEnv" });

      await request(app.getHttpServer())
        .get(`/users/${otherUser.id}/envs/${env.body.id}`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send()
        .expect(HttpStatus.FORBIDDEN);
    });

    it(`should return ${HttpStatus.NOT_FOUND} if env does not exist`, async () => {
      const username = "TestUser3";
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

      await request(app.getHttpServer())
        .get(`/users/${user.id}/envs/${faker.string.uuid()}`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send()
        .expect(HttpStatus.NOT_FOUND);
    });

    const mockRoles = [ Role.USER, Role.ADMIN ]
    it.each(mockRoles)("should query env for %s if done by admin", async (role) => {
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

      const env = await createEnv(app, loginResponse.body.accessToken as string, otherUser.id, { name: "TestEnv" });

      const queryResponse = await request(app.getHttpServer())
        .get(`/users/${otherUser.id}/envs/${env.body.id}`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send()
        .expect(HttpStatus.OK);

      expect(queryResponse.body)
        .toEqual(expect.objectContaining(env.body));

      await expect(getEnvs(app, otherUser.id))
        .resolves
        .toContainEqual(expect.objectContaining({ id: queryResponse.body.id }));
    })

    it("should query env for the user", async () => {
      const username = "TestUser4";
      const password = "TestPassword123@";
      const user = await createUser(app, { 
        username, 
        password, 
        role: Role.USER 
      });

      const loginResponse = await login(app, { username, password });
      const env = await createEnv(app, loginResponse.body.accessToken as string, user.id, { name: "TestEnv" });

      const queryResponse = await request(app.getHttpServer())
        .get(`/users/${user.id}/envs/${env.body.id}`)
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
        .send()
        .expect(HttpStatus.OK);

      expect(queryResponse.body)
        .toEqual(expect.objectContaining(env.body));

      await expect(getEnvs(app, user.id))
        .resolves
        .toContainEqual(expect.objectContaining({ id: queryResponse.body.id }));
    });
  });
});
