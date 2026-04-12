import { ConfigurationType } from "./types/configuration.type";
import { config } from "dotenv";

export default (path: string): ConfigurationType => {
    config({ path });
    return {
        type: process.env.TYPE || 'local',
        port: parseInt(process.env.NODE_PORT!, 10),
        cwd: process.cwd(),
        database: {
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT!, 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: process.env.DB_SYNCHRONIZE === 'true'
        },
        grpc: {
            host: process.env.GRPC_HOST!,
            port: parseInt(process.env.GRPC_PORT!, 10),
            secret: process.env.GRPC_ACCESS_TOKEN_SECRET!
        },
        jwt: {
            access: {
                secret: process.env.JWT_ACCESS_SECRET!,
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN!
            },
            refresh: {
                secret: process.env.JWT_REFRESH_SECRET!,
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN!
            }
        },
        hash: {
            rounds: parseInt(process.env.HASH_SALT_ROUNDS!, 10)
        },
        scripts: {
            concurrency: parseInt(process.env.SCRIPT_RUNS_CONCURRENCY!, 10)
        },
        init: {
            superadmin: {
                username: process.env.INITIAL_ADMIN_USERNAME!,
                password: process.env.INITIAL_ADMIN_PASSWORD!
            }
        }
    }
}