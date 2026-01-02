import { UserEntity } from "src/users/entities/user.entity";
import { FakeRefreshToken } from "./refresh-token";
import { OmitType } from "@nestjs/swagger";
import { FakeEnv } from "./env";
import { FakeScript } from "./script";

export class FakeUser extends OmitType(UserEntity, ['refreshToken', 'envs', 'scripts']) {
  refreshToken?: FakeRefreshToken;
  refreshTokenId?: string;
  unhashedPassword: string;
  envs?: FakeEnv[];
  scripts?: FakeScript[];
}