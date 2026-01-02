import { Controller, Post, UseGuards, Request, Body, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { Role } from '../app.roles';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { UseRoles } from 'nest-access-control';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @UseRoles({ resource: 'auth', action: 'create', possession: 'own' })
  @Post('login')
  @ApiBody({ type: LoginDto })
  login(@Request() req: {
    user: { username: string, id: string, roles: Role[] }
  }) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseRoles({ resource: 'auth', action: 'create', possession: 'own' })
  @Post('logout')
  async logout(@Request() req: {
    user: { username: string, id: string, roles: Role[] }
  }) {
    await this.authService.logout(req.user.id);
    return { message: 'Token revoked' };
  }

  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  @UseRoles({ resource: 'auth', action: 'create', possession: 'own' })
  @Post('refresh-token')
  refresh(@Request() req: {
    user: { username: string, id: string, roles: Role[] }
  }) {
    return this.authService.refresh(req.user.id);
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
