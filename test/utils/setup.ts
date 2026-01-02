import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { AppModule } from "src/app.module";
import { DatabaseModule } from "src/database/database.module";
import { DomainErrorFilter } from "src/shared/filters/domain-error.filter";
import { GlobalClassSerializerInterceptor } from "src/shared/interceptors/global-class-serializer.interceptor";
import { App } from "supertest/types";
import { clearDB, initDB } from "test/utils/database";
import { TestDatabaseModule } from "test/utils/modules/test-database.module";

export async function setupApp(type: "local" | "remote") {
  const dbModule = await TestDatabaseModule.forRoot(type);
  let container: StartedPostgreSqlContainer | null;

  const moduleRef = await Test.createTestingModule({
    imports: [
      AppModule,     
      ConfigModule.forRoot({
        envFilePath: '.env.test',
        isGlobal: true,
      })
    ]
  })
  .overrideModule(DatabaseModule)
  .useModule(dbModule)
  .compile();

  await initDB(moduleRef);

  const app = moduleRef.createNestApplication();
  app.useGlobalInterceptors(new GlobalClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalFilters(new DomainErrorFilter())
  app.useGlobalPipes(new ValidationPipe())
  await app.init();

  // For cleanup if using Postgres testcontainer
  try {
    container = moduleRef.get('POSTGRES_CONTAINER', { strict: false });
  } catch {
    container = null;
  }

  return [app, container] as const;
}

export function setupHooks(
  type: 'local' | 'remote', 
  app: INestApplication<App>, 
  container: StartedPostgreSqlContainer | null
) {
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
}