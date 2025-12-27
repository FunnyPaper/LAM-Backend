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

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
    });
  }

  public async validate(payload: { sub: string, username: string, roles: Role[] }) {
    const user = await this.usersService.tryFindByIdWithRefreshToken(payload.sub);
    if (!user) throw new UserNotFoundError();
    if (!user.refreshToken) throw new TokenRevokedError(user.id);

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET
    });

    const isMatch = await this.hashService.compare(token, user.refreshToken.tokenHash);
    if (!isMatch) throw new InvalidTokenError(user.refreshToken.id, user.id);

    return { id: payload.sub, username: payload.username, roles: payload.roles };
  }
}
