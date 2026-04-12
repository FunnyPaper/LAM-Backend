import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import configuration from './configuration';
import { resolve } from 'path';

export default async () => {
    const argv = await yargs(hideBin(process.argv))
        .scriptName("lam-backend")
        .version("0.1.0")
        .alias("v", "version")
        .help("h")
        .alias("h", "help")
        .option("cwd", {
            type: 'string',
            default: process.cwd(),
            description: "Path to current working directory. Used for resolving additional files."
        })
        .option("node-port", {
            type: "number",
            default: process.env.NODE_PORT,
            description: "Port number backend to start."
        })
        .option("grpc-host", {
            type: "string",
            default: process.env.GRPC_HOST,
            description: "Host address to open connection for grpc service."
        })
        .option("grpc-port", {
            type: "number",
            default: process.env.GRPC_PORT,
            description: "Port number to open connection for grpc service."
        })
        .option("grpc-token-secret", {
            type: "string",
            default: process.env.GRPC_ACCESS_TOKEN_SECRET,
            description: "Secret used for generating short lived tokens."
        })
        .argv
    return [argv, () => {
        const defaults = configuration(resolve(argv.cwd ?? process.cwd(), '.env'));
        return {
            ...defaults,
            port: argv['node-port'] as number ?? defaults.port,
            cwd: argv.cwd ?? defaults.cwd,
            grpc: {
                ...defaults.grpc,
                host: argv['grpc-host'] ?? defaults.grpc.host,
                port: argv['grpc-port'] as number ?? defaults.grpc.port,
                secret: argv['grpc-token-secret'] ?? defaults.grpc.secret
            }
        }
    }] as const
}