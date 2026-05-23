import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalClassSerializerInterceptor } from './shared/interceptors/global-class-serializer.interceptor';
import { DomainErrorFilter } from './shared/filters/domain-error.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import cookieParser from 'cookie-parser';
import configuration from './configuration/configuration';
import { ConfigurationType } from './configuration/types/configuration.type';
import { DynamicIoAdapter } from './scripts/gateways/dynamic-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register(() => configuration(resolve(process.cwd(), '.env')))
  );

  const configService: ConfigService<ConfigurationType> = app.get(ConfigService);
  const type: string = configService.get('type')!;
  const port: number = configService.get('port')!;
  const origin: string = configService.get('origin')!;

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: origin
  });
  app.useWebSocketAdapter(new DynamicIoAdapter(app, origin));

  app.useGlobalInterceptors(new GlobalClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalFilters(new DomainErrorFilter())
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: { enableImplicitConversion: true }
  }))
  app.set('query parser', 'extended');

  const config = new DocumentBuilder()
    .setTitle("LAM Api")
    .setDescription("")
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addCookieAuth(
      "refreshToken",
      { type: 'http', in: 'Header', scheme: 'bearer', bearerFormat: 'JWT' },
      "refresh-token"
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFactory, { swaggerOptions: { persistAuthorization: true } });

  await app.listen(port);
  console.log(`Running in mode ${type} on port ${port}`);
}

void bootstrap();
