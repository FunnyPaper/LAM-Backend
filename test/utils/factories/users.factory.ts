import { faker } from '@faker-js/faker'
import { Role } from "src/app.roles";
import { FakeUser } from "test/utils/entities/user";
import { oneOfObject, OneOfObject } from 'test/utils/one-of-object';
import { HashService } from 'src/shared/providers/hash.service';

const hashService = new HashService()

export type CreateUserConfig = {
  linkRelations?: boolean,
  overrides?: OneOfObject<Partial<FakeUser>>
}
export async function createUser(config?: CreateUserConfig): Promise<FakeUser> {
  const { linkRelations, overrides } = config || {};

  const processedOverrides = overrides && await oneOfObject(overrides);

  const createdAtDate = faker.date.recent();
  const unhashedPassword = processedOverrides?.password ?? faker.internet.password();
  const password = await hashService.hash(unhashedPassword);
  delete processedOverrides?.password;
  delete processedOverrides?.unhashedPassword;

  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    password: password,
    unhashedPassword: unhashedPassword,
    role: faker.helpers.enumValue(Role),
    createdAt: createdAtDate,
    updatedAt: faker.date.soon({ days: 5, refDate: createdAtDate }),
    ...(processedOverrides?.refreshToken && { 
      ...(linkRelations && { refreshToken: processedOverrides.refreshToken }),
      refreshTokenId: processedOverrides.refreshToken.id 
    }),
    ...processedOverrides
  }
}
