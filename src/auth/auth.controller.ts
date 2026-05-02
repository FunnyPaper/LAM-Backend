import { Controller, Post, UseGuards, Request, Body, SerializeOptions, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { Role } from '../app.roles';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { UseRoles } from 'nest-access-control';
import { RegisterDto } from './dtos/register.dto';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    @UseGuards(LocalAuthGuard)
    @UseRoles({ resource: 'auth', action: 'create', possession: 'own' })
    @Post('login')
    @ApiBody({ type: LoginDto })
    async login(@Request() req: {
        user: { username: string, id: string, roles: Role[] }
    }, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken, expires } = await this.authService.login(req.user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/auth/refresh-token',
            expires: expires
        })

        return { accessToken }
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @UseRoles({ resource: 'auth', action: 'create', possession: 'own' })
    @Post('logout')
    async logout(@Request() req: {
        user: { username: string, id: string, roles: Role[] }
    }, @Res({ passthrough: true }) res: Response) {
        await this.authService.logout(req.user.id);

        res.clearCookie('refreshToken', {
            path: '/auth/refresh-token'
        })

        return { message: 'Token revoked' };
    }

    @ApiCookieAuth('refresh-token')
    @UseGuards(JwtRefreshAuthGuard)
    @UseRoles({ resource: 'auth', action: 'create', possession: 'own' })
    @Post('refresh-token')
    async refresh(@Request() req: {
        cookies?: { refreshToken: string },
        user: { username: string, id: string, roles: Role[] }
    }, @Res({ passthrough: true }) res: Response) {
        if (!req.cookies?.refreshToken) {
            throw new UnauthorizedException();
        }

        const { accessToken, refreshToken, expires } = await this.authService.refresh(req.user.id, req.cookies?.refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/auth/refresh-token',
            expires: expires,
        })

        return { accessToken }
    }

    @SerializeOptions({ type: UserDto })
    @Post('register')
    register(
        @Body() body: RegisterDto
    ) {
        const { username, password } = body;
        return this.usersService.tryCreate({
            username,
            password,
            role: Role.USER
        });
    }
}
