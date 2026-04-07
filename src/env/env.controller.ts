import { Controller, Get, Post, Body, Param, Delete, UseGuards, SerializeOptions, Put, Query } from '@nestjs/common';
import { EnvService } from './env.service';
import { CreateEnvDto } from './dto/create-env.dto';
import { UpdateEnvDto } from './dto/update-env.dto';
import { ApiBearerAuth, ApiExtraModels, ApiNoContentResponse, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { EnvDto } from './dto/env.dto';
import { UserOwnershipGuardFactory } from 'src/auth/guards/user-ownership.guard';
import { plainToInstance } from 'class-transformer';
import { ApiDeepQuery } from 'src/shared/decorators/api-deep-query';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { EnvFilterDto, EnvSortDto, QueryEnvDto } from './dto/query-script.dto';
import { PaginatedEnvDto } from './dto/paginated-env.dto';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, ACGuard, UserOwnershipGuardFactory('userId'))
@ApiQuery({ name: 'userId', type: String, required: false })
@Controller('users/:userId/envs')
export class EnvController {
  constructor(private readonly envService: EnvService) {}

  @SerializeOptions({ type: EnvDto })
  @UseRoles({ resource: 'env', action: 'create', possession: 'own' })
  @Post()
  create(
    @Param('userId') userId: string,
    @Body() createEnvDto: CreateEnvDto
  ) {
    return this.envService.create(userId, createEnvDto);
  }

  @SerializeOptions({ type: EnvDto })
  @UseRoles({ resource: 'env', action: 'update', possession: 'own' })
  @Put(':envId')
  update(
    @Param('userId') userId: string,
    @Param('envId') envId: string,
    @Body() updateEnvDto: UpdateEnvDto
  ) {
    return this.envService.update(userId, envId, updateEnvDto);
  }

  @UseRoles({ resource: 'env', action: 'read', possession: 'own' })
  @ApiDeepQuery('filtering', EnvFilterDto)
  @ApiDeepQuery('sorting', EnvSortDto)
  @ApiDeepQuery('pagination', PaginationDto)
  @ApiExtraModels(EnvDto, PaginatedEnvDto)
  @ApiOkResponse({
    schema: {
      oneOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(EnvDto) }
        },
        {
          $ref: getSchemaPath(PaginatedEnvDto)
        }
      ]
    }
  })
  @Get()
  async findAll(
    @Param('userId') userId: string, 
    @Query() dto: QueryEnvDto
  ): Promise<EnvDto[] | PaginatedEnvDto> {
    const results = await this.envService.tryFindAll(userId, dto);

    if ('metadata' in results) {
      return plainToInstance(PaginatedEnvDto, results, { excludeExtraneousValues: true });
    }

    return plainToInstance(EnvDto, results, { excludeExtraneousValues: true });
  }

  @SerializeOptions({ type: EnvDto })
  @UseRoles({ resource: 'env', action: 'read', possession: 'own' })
  @Get(':envId')
  findOne(
    @Param('userId') userId: string,
    @Param('envId') envId: string
  ) {
    return this.envService.findById(userId, envId);
  }

  @ApiNoContentResponse()
  @UseRoles({ resource: 'env', action: 'delete', possession: 'own' })
  @Delete(':envId')
  remove(
    @Param('userId') userId: string,
    @Param('envId') envId: string
  ) {
    return this.envService.remove(userId, envId);
  }
}
