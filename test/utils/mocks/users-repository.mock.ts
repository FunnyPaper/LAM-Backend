import { UserEntity } from "src/users/entities/user.entity";
import { FakeUser } from "test/utils/entities/user";
import { Repository } from "typeorm";

export function createUsersRepossitoryMock(users: FakeUser[]) {
  return {
    find: jest.fn().mockImplementation().mockReturnValue(users),
    findOne: jest.fn().mockImplementation(({ where, relations }) => {
      const { id, username, role } = where || {};
      const { refreshToken } = relations || {};
      const result = users.map(u => {
        if(!refreshToken) {
          delete u.refreshToken;
        }

        return u;
      }).find(u => !(
          (id != null && u.id != id)
          || (username && u.username != username)
          || (role && u.role != role)
        )
      ) ?? null;

      return Promise.resolve(result);
    }),
    create: jest.fn().mockImplementation(obj => ({ ...obj })),
    update: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(obj => ({ ...obj }))
  } satisfies Pick<Repository<UserEntity>, 
    | 'find'
    | 'findOne'
    | 'create'
    | 'update'
    | 'save'
  > 
}