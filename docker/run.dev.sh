#!/bin/sh
npm run build

npm run migrations:$TYPE:migrate

npm run command:init

npm run start:dev