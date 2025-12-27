import { faker } from '@faker-js/faker'
import { FakeRefreshToken } from "test/utils/entities/refresh-token";
import { FakeUser } from 'test/utils/entities/user';
import { OneOfObject, oneOfObject } from 'test/utils/one-of-object';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { computeDate } from 'src/utils/ms.utils';
import { HashService } from 'src/shared/providers/hash.service';

const jwtService = new JwtService()
const hashService = new HashService()

export type CreateRefreshTokenConfig = {
  linkRelations?: boolean,
  overrides?: OneOfObject<Partial<FakeRefreshToken>>
}
export async function createRefreshToken(config?: CreateRefreshTokenConfig): Promise<FakeRefreshToken> {
  const { linkRelations, overrides } = config || {};

  const createdAtDate = faker.date.recent({ days: 1 });
  const updatedAtDate = faker.date.soon({ days: 5, refDate: createdAtDate });

  const processedOverrides = overrides && await oneOfObject(overrides);

  const result = {
    id: faker.string.uuid(),
    createdAt: createdAtDate,
    updatedAt: updatedAtDate,
    expiresAt: computeDate(process.env.JWT_REFRESH_EXPIRES_IN! as ms.StringValue),
    // If user provided, assign userId and generate tokenHash (if not provided)
    ...(processedOverrides?.user && { 
      ...(linkRelations && { user: processedOverrides.user }),
      userId: processedOverrides.id
    }
    ),
    ...processedOverrides
  }

  if(processedOverrides?.user && !result.tokenHash) {
    const hash = await createTokenHash({
      user: processedOverrides.user, 
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN! as ms.StringValue,
    });
    result.tokenHash = hash;
  }

  return result;
}

export type CreateTokenHashConfig = {
  user: FakeUser, secret: string, expiresIn: ms.StringValue
}
export async function createTokenHash(config: CreateTokenHashConfig) {
  const { user, secret, expiresIn } = config;

  const jwtToken = jwtService.sign({ 
    sub: user.id, 
    username: user.username, 
    roles: [ user.role ]
  }, {
    expiresIn: expiresIn,
    secret: secret,
  });

  return await hashService.hash(jwtToken);
}
