// File used by typeorm cli commands

// NOTE: env variables need to be loaded as the very first thing.
// Some entities needs to decide the correct type of the field
import { config } from "dotenv";
config({ path: '.env.local' });

import { ConfigService } from "@nestjs/config";
import configuration from "../configuration/configuration";
import { DataSource } from "typeorm";
import { ormconfig } from "./ormconfig";

export default new DataSource(
  ormconfig(new ConfigService(configuration()))
);