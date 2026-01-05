import { Controller, Get, Post, Body, Param, Delete, Patch, Request, UseGuards, SerializeOptions, Query } from '@nestjs/common';
import { CreateScriptRunDto } from './dto/create-script-run.dto';
import { QueryScriptRunDto, ScriptRunFilterDto, ScriptRunSortDto } from './dto/query-script-run.dto';
import { ReexecuteScriptRunDto } from './dto/reexecute-script-run.dto';
import { ScriptsRunsService } from './scripts-runs.service';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { UserRequestIdGuard } from 'src/auth/guards/user-request-id-guard';
import { ScriptRunDto } from './dto/script-run.dto';
import { RequestUserId } from 'src/auth/decorators/request-user-id';
import { ApiDeepQuery } from 'src/shared/decorators/api-deep-query';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginatedScriptRunDto } from './dto/paginated-script-run.dto';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, ACGuard, UserRequestIdGuard)
@ApiQuery({ name: 'userId', type: String, required: false })
@Controller('runs')
export class ScriptsRunsController {
  constructor(private readonly scriptsRunsService: ScriptsRunsService) {}

  @SerializeOptions({ type: ScriptRunDto })
  @UseRoles({ resource: 'scripts-runs', action: 'create', possession: 'own' })
  @Post()
  create(
    @RequestUserId() userId: string,
    @Body() dto: CreateScriptRunDto
  ) {
    return this.scriptsRunsService.create(userId, dto);
  }

  @SerializeOptions({ type: ScriptRunDto })
  @UseRoles({ resource: 'scripts-runs', action: 'read', possession: 'own' })
  @Get(':id')
  findOne(
    @RequestUserId() userId: string,
    @Param('id') id: string
  ) {
    return this.scriptsRunsService.findById(userId, id);
  }

  @SerializeOptions({ excludeExtraneousValues: true })
  @UseRoles({ resource: 'scripts-runs', action: 'read', possession: 'own' })
  @ApiDeepQuery('filtering', ScriptRunFilterDto)
  @ApiDeepQuery('sorting', ScriptRunSortDto)
  @ApiDeepQuery('pagination', PaginationDto)
  @ApiExtraModels(ScriptRunDto, PaginatedScriptRunDto)
  @ApiOkResponse({
    schema: {
      oneOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(ScriptRunDto) }
        },
        {
          $ref: getSchemaPath(PaginatedScriptRunDto)
        }
      ]
    }
  })
  @Get()
  async findAll(
    @RequestUserId() userId: string,
    @Query() dto: QueryScriptRunDto
  ): Promise<ScriptRunDto[] | PaginatedScriptRunDto> {
    const results = await this.scriptsRunsService.findAll(userId, dto);

    if('metadata' in results) {
      return plainToInstance(PaginatedScriptRunDto, results, { excludeExtraneousValues: true });
    }

    return plainToInstance(ScriptRunDto, results, { excludeExtraneousValues: true });
  }

  @SerializeOptions({ type: ScriptRunDto })
  @UseRoles({ resource: 'scripts-runs', action: 'update', possession: 'own' })
  @Patch(':id/cancel')
  cancel(
    @RequestUserId() userId: string,
    @Param('id') id: string
  ) {
    return this.scriptsRunsService.cancel(userId, id);
  }

  @SerializeOptions({ type: ScriptRunDto })
  @UseRoles({ resource: 'scripts-runs', action: 'create', possession: 'own' })
  @Post(':id/reexecute')
  reexecute(
    @RequestUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: ReexecuteScriptRunDto
  ) {
    return this.scriptsRunsService.reexecute(userId, id, dto);
  }

  @UseRoles({ resource: 'scripts-runs', action: 'delete', possession: 'own' })
  @Delete(':id')
  remove(
    @RequestUserId() userId: string,
    @Param('id') id: string
  ) {
    return this.scriptsRunsService.remove(userId, id);
  }
}
