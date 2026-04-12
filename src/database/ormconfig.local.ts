// File used by typeorm cli commands

import { ConfigService } from "@nestjs/config";
import configuration from "../configuration/configuration";
import { DataSource } from "typeorm";
import { ormconfig } from "./ormconfig";

export default new DataSource(
    ormconfig(new ConfigService(configuration('.env.local')))
);