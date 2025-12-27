import { ConfigurationType } from "./types/configuration.type";

export default () => ({
  type: process.env.TYPE || 'local',
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '0', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true'
  }
} satisfies ConfigurationType)