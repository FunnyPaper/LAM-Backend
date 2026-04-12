import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Role } from '../../app.roles';
import { UsersService } from '../../users/users.service';
import { UserNotFoundError } from '../../users/errors/user-not-found.error';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType, JWTConfiguration } from 'src/configuration/types/configuration.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersService: UsersService, configService: ConfigService<ConfigurationType>) {
        const jwt: JWTConfiguration = configService.get('jwt')!;
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwt.access.secret,
        });
    }

    public async validate(payload: { sub: string, username: string, roles: Role }) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) throw new UserNotFoundError();
        return { id: payload.sub, username: payload.username, roles: payload.roles };
    }
}
