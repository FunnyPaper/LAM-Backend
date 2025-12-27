#!/bin/sh
npm run migrations:$TYPE:migrate

npm run command:init

npm run start:debug -- 0.0.0.0:$DEBUG_PORT