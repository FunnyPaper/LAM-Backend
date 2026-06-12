# LAM Backend

NestJS-based backend service for LAM, providing gRPC microservices, REST API, WebSocket communication, and database management.

## Badges

[![GitHub Release](https://img.shields.io/github/v/release/FunnyPaper/LAM?label=backend)](https://github.com/FunnyPaper/LAM/releases)
[![GitHub License](https://img.shields.io/github/license/FunnyPaper/LAM)](https://github.com/FunnyPaper/LAM/blob/main/LICENSE)

## Description

The LAM Backend is a Node.js service built with NestJS that handles business logic, data persistence, and inter-service communication. It uses gRPC for protobuf-based microservice communication, TypeORM for database operations (PostgreSQL/SQLite), and supports both local and remote deployment via Docker.

## Project Structure

```
packages/lam/backend/
├── src/                    # NestJS application source
│   ├── main-app.ts         # Application entry point
│   ├── main-cli.ts         # CLI entry point
│   ├── database/            # Database configuration
│   └── ...                 # Modules, controllers, services
├── test/                   # E2E and unit tests
├── migrations/              # Database migrations
├── scripts/                 # Build scripts
├── installer/               # Windows installer config
├── package.json             # npm dependencies
├── tsconfig.json            # TypeScript configuration
└── docker-compose*.yml      # Docker configurations
```

## Prerequisites

- [Node.js](https://nodejs.org/) 24.x or later
- [npm](https://www.npmjs.com/) 9.x or later
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- [Buf](https://buf.build/) (for protobuf code generation)
- [Nasm](https://www.nasm.us/pub/nasm/releasebuilds/) (for compiling Node into executable). It is recommended to use the newest version available.
- [Python](https://www.python.org/downloads/) (for compiling Node into executable). It is recommended to use Python 3.11.x. Building was tested on Python 3.11.9.
- [Visual Studio](https://visualstudio.microsoft.com/downloads/) (for compiling Node into executable). It needs C++ classic app development and Clang/LLVm support. It is recommended to use Visual Studio 2022 or later.

## Project setup

```bash
$ npm install
```

## Compile and run the project

Should be called at least once before proceeding:

```bash
# copy environment files - setup content according to your needs
$ cp .env.template .env.local
$ cp .env.template .env.remote

# build all project files
$ npm run build

# run db migrations for specified target (local or remote)
$ npm run migrations:<local | remote>:migrate

# initialize db with starting data
$ npm run command:init<local | remote>
```

All supported run configurations:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug -- <port>

# production mode
$ npm run start:prod

# alternatives running inside docker
$ npm run docker:<local | remote>:<prod | dev | debug>
```

Other usefull scripts

```bash
# generate migration file at specified target
# ideally it should be either ./migrations/local/xyz or ./migrations/remote/xyz depending on the target
$ npm run migrations:<local | remote>:generate <path>

# revert specified db by one migration
$ npm run migrations:<local | remote>:revert
```

## Run tests

To disable e2e test for any target, edit .env.test file - set appropriate variable to 0. Remote tests require docker on the host machine to be installed. Those tests might also need more time to setup - 60s was chosen as a timeout value for each e2e test.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
