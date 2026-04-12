import { AuthController } from '../auth.controller';
import { createUser } from 'test/utils/factories/users.factory';
import { createRefreshToken } from 'test/utils/factories/refresh-token.factory';
import { Role } from 'src/app.roles';
import { createMocks } from './utils/controller/create-mocks';
import { type Response } from 'express';
import bcryptjs from 'bcryptjs';

describe(AuthController.name, () => {
    describe(`::${AuthController.prototype.login.name} should`, () => {
        it('return pair of tokens', async () => {
            const user = await createUser();
            user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user } });
            const [controller] = await createMocks([user]);
            const req = { user: { username: user.username, id: user.id, roles: [user.role] } };
            const res = { cookie: jest.fn() } as unknown as Response;
            const spy = jest.spyOn(res, 'cookie');

            await expect(controller.login(req, res))
                .resolves
                .toEqual({
                    accessToken: expect.any(String)
                });

            expect(spy).toHaveBeenCalledWith("refreshToken", expect.any(String), expect.any(Object))
        });
    });
    describe(`::${AuthController.prototype.logout.name} should`, () => {
        it('return message upon successful logout', async () => {
            const user = await createUser();
            user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user } });
            const [controller] = await createMocks([user]);
            const req = { user: { username: user.username, id: user.id, roles: [user.role] } };
            const res = { clearCookie: jest.fn() } as unknown as Response;
            const spy = jest.spyOn(res, 'clearCookie');

            await expect(controller.logout(req, res))
                .resolves
                .toEqual({ message: expect.any(String) });

            expect(spy).toHaveBeenCalledWith("refreshToken", expect.objectContaining({ path: "/auth/refresh-token" }));
        })
    });
    describe(`::${AuthController.prototype.refresh.name} should`, () => {
        it('return new pair of tokens', async () => {
            const user = await createUser();
            user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user } });
            const [controller] = await createMocks([user]);
            const req = {
                user: { username: user.username, id: user.id, roles: [user.role] },
                cookies: { refreshToken: "refresh-token" }
            };
            const res = { cookie: jest.fn() } as unknown as Response;
            const spy = jest.spyOn(res, 'cookie');

            const compareSpy = jest.spyOn(bcryptjs, 'compare')
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                .mockImplementation(() => Promise.resolve(true))

            await expect(controller.refresh(req, res))
                .resolves
                .toEqual({
                    accessToken: expect.any(String)
                });

            expect(spy).toHaveBeenCalledWith("refreshToken", expect.any(String), expect.any(Object))

            compareSpy.mockRestore();
        })
    });
    describe(`::${AuthController.prototype.register.name} should`, () => {
        it('create and return a new user', async () => {
            const user = await createUser({ overrides: { role: Role.USER } });
            user.refreshToken = await createRefreshToken({ linkRelations: true, overrides: { user } });
            const [controller] = await createMocks([]);
            const userDto = { username: user.username, password: user.unhashedPassword, role: user.role }

            await expect(controller.register(userDto))
                .resolves
                .toMatchObject({ username: userDto.username, role: userDto.role });
        });
    });
});
