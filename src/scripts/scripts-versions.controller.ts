import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query, Request, UseGuards, SerializeOptions } from '@nestjs/common';
import { CreateScriptVersionDto } from './dto/create-script-version.dto';
import { QueryScriptVersionDto, ScriptVersionFilterDto, ScriptVersionSortDto } from './dto/query-script-version.dto';
import { UpdateScriptVersionDto } from './dto/update-script-version.dto';
import { ScriptsVersionsService } from './scripts-versions.service';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { UserRequestIdGuard } from 'src/auth/guards/user-request-id-guard';
import { ScriptVersionDto } from './dto/script-version.dto';
import { RequestUserId } from 'src/auth/decorators/request-user-id';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ApiDeepQuery } from 'src/shared/decorators/api-deep-query';
import { PaginatedScriptVersionDto } from './dto/paginated-script-version.dto';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, ACGuard, UserRequestIdGuard)
@ApiQuery({ name: 'userId', type: String, required: false })
@Controller('scripts/:scriptId/versions')
export class ScriptsVersionsController {
  constructor(private readonly scriptsVersionsService: ScriptsVersionsService) {}

  @SerializeOptions({ type: ScriptVersionDto })
  @UseRoles({ resource: 'scripts-versions', action: 'create', possession: 'own' })
  @Post()
  create(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string,
    @Body() dto: CreateScriptVersionDto
  ) {
    return this.scriptsVersionsService.create(userId, scriptId, dto);
  }

  @SerializeOptions({ type: ScriptVersionDto })
  @UseRoles({ resource: 'scripts-versions', action: 'read', possession: 'own' })
  @Get(':scriptVersionId')
  findOne(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string,
    @Param('scriptVersionId') scriptVersionId: string
  ) {
    return this.scriptsVersionsService.findById(userId, scriptId, scriptVersionId);
  }

  @SerializeOptions({ excludeExtraneousValues: true })
  @UseRoles({ resource: 'scripts-versions', action: 'read', possession: 'own' })
  @ApiDeepQuery('filtering', ScriptVersionFilterDto)
  @ApiDeepQuery('sorting', ScriptVersionSortDto)
  @ApiDeepQuery('pagination', PaginationDto)
  @ApiExtraModels(ScriptVersionDto, PaginatedScriptVersionDto)
  @ApiOkResponse({
    schema: {
      oneOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(ScriptVersionDto) }
        },
        {
          $ref: getSchemaPath(PaginatedScriptVersionDto)
        }
      ]
    }
  })
  @Get()
  async findAll(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string,
    @Query() dto: QueryScriptVersionDto
  ): Promise<ScriptVersionDto[] | PaginatedScriptVersionDto> {
    const results = await this.scriptsVersionsService.findAll(userId, scriptId, dto);

    if('metadata' in results) {
      return plainToInstance(PaginatedScriptVersionDto, results, { excludeExtraneousValues: true });
    }

    return plainToInstance(ScriptVersionDto, results, { excludeExtraneousValues: true });
  }

  @SerializeOptions({ type: ScriptVersionDto })
  @UseRoles({ resource: 'scripts-versions', action: 'update', possession: 'own' })
  @Put(':scriptVersionId')
  update(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string,
    @Param('scriptVersionId') scriptVersionId: string,
    @Body() dto: UpdateScriptVersionDto
  ) {
    return this.scriptsVersionsService.update(userId, scriptId, scriptVersionId, dto);
  }

  @SerializeOptions({ type: ScriptVersionDto })
  @UseRoles({ resource: 'scripts-versions', action: 'create', possession: 'own' })
  @Post(':scriptVersionId/fork')
  fork(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string,
    @Param('scriptVersionId') scriptVersionId: string,
  ) {
    return this.scriptsVersionsService.fork(userId, scriptId, scriptVersionId);
  }

  @SerializeOptions({ type: ScriptVersionDto })
  @UseRoles({ resource: 'scripts-versions', action: 'update', possession: 'own' })
  @Patch(':scriptVersionId/publish')
  publish(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string,
    @Param('scriptVersionId') scriptVersionId: string,
  ) {
    return this.scriptsVersionsService.publish(userId, scriptId, scriptVersionId);
  }

  @UseRoles({ resource: 'scripts-versions', action: 'delete', possession: 'own' })
  @Delete(':scriptVersionId')
  remove(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string,
    @Param('scriptVersionId') scriptVersionId: string,
  ) {
    return this.scriptsVersionsService.remove(userId, scriptId, scriptVersionId);
  }
}
