import { UserEntity } from "src/users/entities/user.entity";
import { FakeRefreshToken } from "./refresh-token";
import { OmitType } from "@nestjs/swagger";

export class FakeUser extends OmitType(UserEntity, ['refreshToken']) {
  refreshToken?: FakeRefreshToken;
  refreshTokenId?: string;
  unhashedPassword: string;
}