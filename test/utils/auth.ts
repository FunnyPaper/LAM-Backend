import { INestApplication } from "@nestjs/common";
import request from 'supertest';
import { App } from "supertest/types";

type RegisterConfig = {
  username: string;
  password: string;
}

export function register(app: INestApplication<App>, { username, password }: RegisterConfig) {
  return request(app.getHttpServer())
    .post('/auth/register')
    .send({ username, password })
}

type LoginConfig = {
  username: string;
  password: string;
}

export function login(app: INestApplication<App>, { username, password }: LoginConfig) {
  return request(app.getHttpServer())
    .post('/auth/login')
    .send({ username, password })
}

export async function registerAndLogin(
  app: INestApplication<App>, 
  { username, password }: RegisterConfig & LoginConfig
) {
  await register(app, { username, password });
  return await login(app, { username, password });
}