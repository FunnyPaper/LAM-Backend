import { Controller, Get, Post, Body, Param, Delete, UseGuards, SerializeOptions, Put } from '@nestjs/common';
import { EnvService } from './env.service';
import { CreateEnvDto } from './dto/create-env.dto';
import { UpdateEnvDto } from './dto/update-env.dto';
import { ApiBearerAuth, ApiNoContentResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { EnvDto } from './dto/env.dto';
import { UserOwnershipGuardFactory } from 'src/auth/guards/user-ownership.guard';
import { EnvOwnershipGuardFactory } from './guards/env-ownership.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, ACGuard, UserOwnershipGuardFactory('userId'))
@Controller('users/:userId/envs')
export class EnvController {
  constructor(private readonly envService: EnvService) {}

  @SerializeOptions({ type: EnvDto })
  @UseRoles({ resource: 'env', action: 'create', possession: 'own' })
  @Post()
  create(
    @Param("userId") userId: string,
    @Body() createEnvDto: CreateEnvDto
  ) {
    return this.envService.create(userId, createEnvDto);
  }

  @SerializeOptions({ type: EnvDto })
  @UseGuards(EnvOwnershipGuardFactory('userId', 'envId'))
  @UseRoles({ resource: 'env', action: 'update', possession: 'own' })
  @Put(':envId')
  update(
    @Param('userId') userId: string,
    @Param('envId') envId: string,
    @Body() updateEnvDto: UpdateEnvDto
  ) {
    return this.envService.update(userId, envId, updateEnvDto);
  }

  @SerializeOptions({ type: EnvDto })
  @UseRoles({ resource: 'env', action: 'read', possession: 'own' })
  @Get()
  findAll(@Param("userId") userId: string) {
    return this.envService.tryFindAll(userId);
  }

  @SerializeOptions({ type: EnvDto })
  @UseGuards(EnvOwnershipGuardFactory('userId', 'envId'))
  @UseRoles({ resource: 'env', action: 'read', possession: 'own' })
  @Get(':envId')
  findOne(
    @Param('userId') userId: string,
    @Param('envId') envId: string
  ) {
    return this.envService.findById(userId, envId);
  }

  @ApiNoContentResponse()
  @UseGuards(EnvOwnershipGuardFactory('userId', 'envId'))
  @UseRoles({ resource: 'env', action: 'delete', possession: 'own' })
  @Delete(':envId')
  remove(
    @Param('userId') userId: string,
    @Param('envId') envId: string
  ) {
    return this.envService.remove(userId, envId);
  }
}
