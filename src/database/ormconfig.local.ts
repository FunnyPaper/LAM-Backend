// File used by typeorm cli commands

import { ConfigService } from "@nestjs/config";
import configuration from "../configuration/configuration";

// NOTE: env variables need to be loaded as the very first thing.
// Some entities needs to decide the correct type of the field
const configService = new ConfigService(configuration('.env.local'));

import { DataSource } from "typeorm";
import { ormconfig } from "./ormconfig";

export default new DataSource(ormconfig(configService));