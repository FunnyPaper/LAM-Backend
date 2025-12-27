import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Role } from '../app.roles';
import { RefreshTokenService } from '../tokens/refresh-token.service';
import ms from 'ms';
import { computeDate } from 'src/utils/ms.utils';
import { HashService } from 'src/shared/providers/hash.service';
import { CredentialMismatchError } from './errors/credential-mismatch.error';
import { UserNotFoundError } from '../users/errors/user-not-found.error';
import { TokenRevokedError } from '../tokens/errors/token-revoked.error';
import { TokenExpiredError } from '../tokens/errors/token-expired.error';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private hashService: HashService
  ) {}

  async validateLocalUser(config: {
    username: string,
    password: string
  }) {
    const { username, password } = config;

    const user = await this.usersService.tryFindOneByUsername(username);
    if(!user) throw new CredentialMismatchError(username);

    const valid = await this.hashService.compare(password, user.password);
    if(!valid) throw new CredentialMismatchError(username);
    
    return {
      id: user.id,
      username: user.username,
      roles: [user.role]
    };
  }

  public async login(user: {
    username: string,
    id: string,
    roles: Role[]
  }) {
    const userEntity = await this.usersService.findById(user.id);
    if(!userEntity) throw new UserNotFoundError();

    const [ accessToken, refreshToken ] = await Promise.all([
        this.signAccessToken(user),
        this.signRefreshToken(user)
    ])

    const hash = await this.hashService.hash(refreshToken);
    const expires = computeDate(process.env.JWT_REFRESH_EXPIRES_IN! as ms.StringValue);
    await this.refreshTokenService.create({ hash, user: userEntity, expires });

    return { accessToken, refreshToken }
  }

  public async refresh(userId: string) {
    const user = await this.usersService.tryFindByIdWithRefreshToken(userId);
    if(!user) {
      throw new UserNotFoundError();
    }

    if(!user.refreshToken) {
      throw new TokenRevokedError(user.id);
    }

    if(new Date() > user.refreshToken.expiresAt) {
      throw new TokenExpiredError(user.refreshToken.id, user.id, user.refreshToken.expiresAt);
    }

    return this.login({
      id: user.id,
      username: user.username,
      roles: [user.role]
    });
  }

  public signRefreshToken(user: {
    username: string,
    id: string,
    roles: Role[]
  }) {
    return this.jwtService.signAsync(
      { sub: user.id, username: user.username, roles: user.roles },
      { 
        // Api author have a stroke - string union has to be set here but no type to cast is provided
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as unknown as number,
        secret: process.env.JWT_REFRESH_SECRET!,
      }
    )
  }

  public signAccessToken(user: {
    username: string,
    id: string,
    roles: Role[]
  }) {
    return this.jwtService.signAsync(
      { sub: user.id, username: user.username, roles: user.roles },
      {
        // Api author have a stroke - string union has to be set here but no type to cast is provided
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN! as unknown as number,
        secret: process.env.JWT_ACCESS_SECRET!, 
      }
    )
  }

  public async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId);
  }
}
