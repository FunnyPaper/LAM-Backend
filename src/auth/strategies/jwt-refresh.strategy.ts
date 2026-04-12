import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Role } from '../../app.roles';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../shared/providers/hash.service';
import { UserNotFoundError } from '../../users/errors/user-not-found.error';
import { TokenRevokedError } from '../../tokens/errors/token-revoked.error';
import { InvalidTokenError } from '../../tokens/errors/invalid-token.error';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType, JWTConfiguration } from 'src/configuration/types/configuration.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService<ConfigurationType>,
        private jwtService: JwtService,
        private hashService: HashService
    ) {
        const jwt: JWTConfiguration = configService.get('jwt')!;
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies?.refreshToken]),
            ignoreExpiration: false,
            secretOrKey: jwt.refresh.secret,
        });
    }

    public async validate(payload: { sub: string, username: string, roles: Role[] }) {
        const user = await this.usersService.tryFindByIdWithRefreshToken(payload.sub);
        if (!user) throw new UserNotFoundError();
        if (!user.refreshToken) throw new TokenRevokedError(user.id);

        const jwt: JWTConfiguration = this.configService.get('jwt')!;
        const token = this.jwtService.sign(payload, {
            secret: jwt.refresh.secret
        });

        const isMatch = await this.hashService.compare(token, user.refreshToken.tokenHash);
        if (!isMatch) throw new InvalidTokenError(user.refreshToken.id, user.id);

        return { id: payload.sub, username: payload.username, roles: payload.roles };
    }
}
