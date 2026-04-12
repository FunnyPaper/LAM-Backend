import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { ConfigService } from '@nestjs/config';
import { ConfigurationType, GRPCConfiguration, JWTConfiguration } from 'src/configuration/types/configuration.type';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService<ConfigurationType>,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService,
        private hashService: HashService
    ) { }

    async validateLocalUser(config: {
        username: string,
        password: string
    }) {
        const { username, password } = config;

        const user = await this.usersService.tryFindOneByUsername(username);
        if (!user) throw new CredentialMismatchError(username);

        const valid = await this.hashService.compare(password, user.password);
        if (!valid) throw new CredentialMismatchError(username);

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
        if (!userEntity) throw new UserNotFoundError();

        const [accessToken, refreshToken] = await Promise.all([
            this.signAccessToken(user),
            this.signRefreshToken(user)
        ])

        const hash = await this.hashService.hash(refreshToken);
        const jwt: JWTConfiguration = this.configService.get('jwt')!;
        const expires = computeDate(jwt.refresh.expiresIn as ms.StringValue);
        await this.refreshTokenService.create({ hash, user: userEntity, expires });

        return { accessToken, refreshToken, expires }
    }

    public async refresh(userId: string, token: string) {
        const user = await this.usersService.tryFindByIdWithRefreshToken(userId);
        if (!user) {
            throw new UserNotFoundError();
        }

        if (!user.refreshToken) {
            throw new TokenRevokedError(user.id);
        }

        if (new Date() > user.refreshToken.expiresAt) {
            throw new TokenExpiredError(user.refreshToken.id, user.id, user.refreshToken.expiresAt);
        }

        const isMatch = await this.hashService.compare(token, user.refreshToken.tokenHash);
        if (!isMatch) {
            throw new UnauthorizedException();
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
        const jwt: JWTConfiguration = this.configService.get('jwt')!;
        return this.jwtService.signAsync(
            { sub: user.id, username: user.username, roles: user.roles },
            {
                // Api author have a stroke - string union has to be set here but no type to cast is provided
                expiresIn: jwt.refresh.expiresIn as ms.StringValue,
                secret: jwt.refresh.secret,
            }
        )
    }

    public signAccessToken(user: {
        username: string,
        id: string,
        roles: Role[]
    }) {
        const jwt: JWTConfiguration = this.configService.get('jwt')!;
        return this.jwtService.signAsync(
            { sub: user.id, username: user.username, roles: user.roles },
            {
                // Api author have a stroke - string union has to be set here but no type to cast is provided
                expiresIn: jwt.access.expiresIn as ms.StringValue,
                secret: jwt.access.secret,
            }
        )
    }

    public async logout(userId: string) {
        await this.usersService.clearRefreshToken(userId);
    }

    public async verify(token: string) {
        const jwt: JWTConfiguration = this.configService.get('jwt')!;
        const payload = this.jwtService.verify(token, {
            secret: jwt.access.secret
        });
        return this.usersService.findById(payload.sub as string);
    }

    public createGrpcToken(userId: string, scope: string[], payload?: Record<string, string>) {
        const grpc: GRPCConfiguration = this.configService.get('grpc')!;
        return this.jwtService.sign(
            {
                iss: 'api-service',
                sub: 'script-run',
                userId,
                scope,
                ...payload
            },
            {
                secret: grpc.secret,
                expiresIn: '2m'
            },
        );
    }
}
