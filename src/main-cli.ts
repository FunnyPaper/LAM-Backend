#!/usr/bin/env node
import { CommandFactory } from "nest-commander";
import { CommandModule } from "./commands/command.module";
import configuration from "./configuration/configuration";
import { resolve } from "path";

async function bootstrap() {
    await CommandFactory.run(
        CommandModule.register(() => configuration(resolve(process.cwd(), process.argv[3] ?? '.env'))),
        ['warn', 'error']
    );
}

void bootstrap();