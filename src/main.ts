import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalClassSerializerInterceptor } from './shared/interceptors/global-class-serializer.interceptor';
import { DomainErrorFilter } from './shared/filters/domain-error.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new GlobalClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalFilters(new DomainErrorFilter())
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: { enableImplicitConversion: true }
  }))
  app.set('query parser', 'extended');

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
