export type ConfigurationType = {
    type: string,
    port: number,
    origin: string,
    cwd: string,
    appDir: string,
    database: DatabaseConfiguration,
    grpc: GRPCConfiguration,
    jwt: JWTConfiguration,
    hash: HashConfiguration,
    scripts: ScriptsConfiguration,
    init: InitConfiguration
}

export type DatabaseConfiguration = {
    type?: string,
    host?: string,
    port: number,
    username?: string,
    password?: string,
    database?: string,
    synchronize: boolean
}

export type GRPCConfiguration = {
    host: string,
    port: number,
    secret: string
}

export type JWTConfiguration = {
    access: {
        secret: string,
        expiresIn: string
    },
    refresh: {
        secret: string,
        expiresIn: string
    }
}

export type HashConfiguration = {
    rounds: number
}

export type ScriptsConfiguration = {
    concurrency: number
}

export type InitConfiguration = {
    superadmin: {
        username: string,
        password: string
    }
}