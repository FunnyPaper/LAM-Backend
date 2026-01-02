import { Body, Controller, Get, Param, Post, Request, SerializeOptions, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { UserDto } from './dtos/user.dto';
import { ACGuard, UseRoles } from 'nest-access-control';
import { Role } from '../app.roles';
import { UserOwnershipGuardFactory } from 'src/auth/guards/user-ownership.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, ACGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiCreatedResponse({ type: UserDto })
  @UseRoles({ resource: 'users', action: 'read', possession: 'any' })
  @SerializeOptions({ type: UserDto })
  @Get()
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @ApiCreatedResponse({ type: UserDto })
  @UseGuards(UserOwnershipGuardFactory('id'))
  @UseRoles({ resource: 'users', action: 'read', possession: 'own' })
  @SerializeOptions({ type: UserDto })
  @Get(':id')
  find(
    @Request() req: { username: string, id: string, roles: Role[] },
    @Param('id') id: string
  ): Promise<UserDto> {
    return this.usersService.findById(id);
  }

  @ApiCreatedResponse({ type: UserDto })
  @UseRoles({ resource: 'users', action: 'create', possession: 'any' })
  @SerializeOptions({ type: UserDto })
  @Post()
  create(
    @Request() req: { 
      user: { 
        id: string, 
        username: string, 
        roles: Role[] 
      } 
    },
    @Body() body: CreateUserDto
  ) {
    const { username, password, role } = body;

    return this.usersService.tryCreateWithSupervisor({ 
      creator: req.user, 
      username,
      password,
      role: role
    });
  }
}
