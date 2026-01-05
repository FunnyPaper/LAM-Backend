import { Controller, Get, Post, Body, Param, Delete, Put, Query, Request, UseGuards, SerializeOptions } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import { QueryScriptDto, ScriptFilterDto, ScriptSortDto } from './dto/query-script.dto';
import { ScriptDto } from './dto/script.dto';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { UserRequestIdGuard } from 'src/auth/guards/user-request-id-guard';
import { RequestUserId } from 'src/auth/decorators/request-user-id';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ApiDeepQuery } from 'src/shared/decorators/api-deep-query';
import { PaginatedScriptDto } from './dto/paginated-script.dto';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, ACGuard, UserRequestIdGuard)
@ApiQuery({ name: 'userId', type: String, required: false })
@Controller('scripts')
export class ScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @SerializeOptions({ type: ScriptDto })
  @UseRoles({ resource: 'scripts', action: 'create', possession: 'own' })
  @Post()
  create(
    @RequestUserId() userId: string,
    @Body() dto: CreateScriptDto
  ) {
    return this.scriptsService.create(userId, dto);
  }

  @SerializeOptions({ type: ScriptDto })
  @UseRoles({ resource: 'scripts', action: 'read', possession: 'own' })
  @Get(':scriptId')
  findOne(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string
  ) {
    return this.scriptsService.findById(userId, scriptId);
  }

  @UseRoles({ resource: 'scripts', action: 'read', possession: 'own' })
  @ApiDeepQuery('filtering', ScriptFilterDto)
  @ApiDeepQuery('sorting', ScriptSortDto)
  @ApiDeepQuery('pagination', PaginationDto)
  @ApiExtraModels(ScriptDto, PaginatedScriptDto)
  @ApiOkResponse({
    schema: {
      oneOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(ScriptDto) }
        },
        {
          $ref: getSchemaPath(PaginatedScriptDto)
        }
      ]
    }
  })
  @Get()
  async findAll(
    @RequestUserId() userId: string,
    @Query() dto: QueryScriptDto
  ): Promise<ScriptDto[] | PaginatedScriptDto> {
    const results = await this.scriptsService.findAll(userId, dto);

    if('metadata' in results) {
      return plainToInstance(PaginatedScriptDto, results, { excludeExtraneousValues: true });
    }

    return plainToInstance(ScriptDto, results, { excludeExtraneousValues: true });
  }

  @SerializeOptions({ type: ScriptDto })
  @UseRoles({ resource: 'scripts', action: 'update', possession: 'own' })
  @Put(':scriptId')
  update(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string,
    @Body() dto: UpdateScriptDto
  ) {
    return this.scriptsService.update(userId, scriptId, dto);
  }

  @UseRoles({ resource: 'scripts', action: 'delete', possession: 'own' })
  @Delete(':scriptId')
  remove(
    @RequestUserId() userId: string,
    @Param('scriptId') scriptId: string
  ) {
    return this.scriptsService.remove(userId, scriptId);
  }
}
