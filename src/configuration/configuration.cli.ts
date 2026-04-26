import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import configuration from './configuration';
import { resolve } from 'path';

export default () => {
    const argv = yargs(hideBin(process.argv))
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
            description: "Port number for backend to start."
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
        .option("ack", {
            type: "boolean",
            default: false,
            description: "Should the backend send a tcp ping once started."
        })
        .option("ack-host", {
            type: "string",
            default: "127.0.0.1",
            description: "Host address to send ack ping to. Ignored if [ack] is set to false."
        })
        .option("ack-port", {
            type: "number",
            default: 9908,
            description: "Port number to send ack ping to. Ignored if [ack] is set to false."
        })
        .option('origin', {
            type: 'array',
            default: 'http://localhost:8080',
            description: "Origin/-s used for cors setup."
        })
        .argv

    return [argv, () => {
        const defaults = configuration(resolve(argv.cwd ?? process.cwd(), '.env'));
        return {
            ...defaults,
            port: argv['node-port'] as unknown as number ?? defaults.port,
            cwd: argv.cwd ?? defaults.cwd,
            grpc: {
                ...defaults.grpc,
                host: argv['grpc-host'] ?? defaults.grpc.host,
                port: argv['grpc-port'] as unknown as number ?? defaults.grpc.port,
                secret: argv['grpc-token-secret'] ?? defaults.grpc.secret
            }
        }
    }] as const
}