# LAM Backend

[![E2E](https://github.com/FunnyPaper/LAM-Backend/actions/workflows/test.e2e.yml/badge.svg)](https://github.com/FunnyPaper/particle-emitter/actions/workflows/test.e2e.yml) [![Unit](https://github.com/FunnyPaper/LAM-Backend/actions/workflows/test.unit.yml/badge.svg)](https://github.com/FunnyPaper/LAM-Backend/actions/workflows/test.unit.yml) [![GitHub Release](https://img.shields.io/github/v/release/FunnyPaper/LAM-Backend)](https://github.com/FunnyPaper/LAM-Backend/releases/latest)
[![GitHub License](https://img.shields.io/github/license/FunnyPaper/LAM-Backend)](https://github.com/FunnyPaper/LAM-Backend/blob/main/LICENSE)

## Description

To be added...

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
