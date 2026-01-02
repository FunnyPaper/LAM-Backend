import { RefreshTokenEntity } from "src/tokens/entities/refresh-token.entity";
import { FakeUser } from "./user";
import { OmitType } from "@nestjs/swagger";

export class FakeRefreshToken extends OmitType(RefreshTokenEntity, ['user', 'tokenHash', 'expiresAt']) {
  user?: FakeUser;
  tokenHash?: string;
  userId?: string;
  expiresAt?: Date;
}
