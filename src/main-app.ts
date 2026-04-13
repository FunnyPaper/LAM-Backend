import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalClassSerializerInterceptor } from './shared/interceptors/global-class-serializer.interceptor';
import { DomainErrorFilter } from './shared/filters/domain-error.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CommandModule } from './commands/command.module';
import { InitCommand } from './commands/init.command';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';
import configurationCli from './configuration/configuration.cli';
import { ConfigurationType } from './configuration/types/configuration.type';
import configuration from './configuration/configuration';
import { resolve } from 'path';
import net from 'net';

async function bootstrap() {
    const [argv, conf] = configurationCli();
    const app = await NestFactory.create<NestExpressApplication>(AppModule.register(conf));

    const dataSource = app.get(DataSource);
    await dataSource.runMigrations();

    const commandContext = await NestFactory.createApplicationContext(
        CommandModule.register(() => configuration(resolve(argv.cwd ?? process.cwd(), '.env')))
    );
    const initCommand = commandContext.get(InitCommand);
    await initCommand.run();
    await commandContext.close();

    app.use(cookieParser());
    app.enableCors({
        credentials: true
    });

    app.useGlobalInterceptors(new GlobalClassSerializerInterceptor(app.get(Reflector)))
    app.useGlobalFilters(new DomainErrorFilter())
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true }
    }))
    app.set('query parser', 'extended');

    const configService: ConfigService<ConfigurationType> = app.get(ConfigService);
    const type: string = configService.get('type')!;
    const port: number = configService.get('port')!;

    const nestServer = await app.listen(port);
    console.log(`Running in mode ${type} on port ${(nestServer.address() as net.AddressInfo).port}`);

    // If ack is set then sends port informations through socket connection
    if (argv.ack) {
        const ackPort = argv['ack-port'];
        const ackHost = argv['ack-host'];

        const client = net.createConnection(
            { port: ackPort, host: ackHost },
            () => {
                const nestPort = (nestServer.address() as net.AddressInfo).port;
                client.write(`PORT=${nestPort}`);
                client.end();
            }
        )
    }
}

void bootstrap();
