import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalClassSerializerInterceptor } from './shared/interceptors/global-class-serializer.interceptor';
import { DomainErrorFilter } from './shared/filters/domain-error.filter';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new GlobalClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalFilters(new DomainErrorFilter())
  app.useGlobalPipes(new ValidationPipe())

  const configService: ConfigService = app.get(ConfigService);
  const type: string = configService.get('type')!;
  const port: string = process.env.NODE_PORT || '3000';

  const config = new DocumentBuilder()
    .setTitle("LAM Api")
    .setDescription("")
    .setVersion('1.0')
    .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
    )
    .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refresh-token',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFactory, { swaggerOptions: { persistAuthorization: true }});

  await app.listen(port);
  console.log(`Running in mode ${type} on port ${port}`);
}

void bootstrap();
