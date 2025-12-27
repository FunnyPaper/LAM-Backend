#!/bin/sh
npm run migrations:$TYPE:migrate

npm run command:init

node dist/src/main.js
