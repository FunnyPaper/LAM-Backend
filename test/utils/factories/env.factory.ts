import { faker } from "@faker-js/faker";
import { FakeEnv } from "../entities/env";
import { oneOfObject, OneOfObject } from "../one-of-object";

export async function createEnv(overrides?: OneOfObject<Partial<FakeEnv>>): Promise<FakeEnv> {
  const processedOverrides = overrides && await oneOfObject(overrides);
  const createdAtDate = faker.date.recent();

  return {
    id: faker.string.uuid(),
    name: faker.company.buzzNoun(),
    description: faker.commerce.productDescription(),
    data: {},
    createdAt: createdAtDate,
    updatedAt: faker.date.soon({ days: 5, refDate: createdAtDate }),
    ...processedOverrides
  }
}