import { Injectable } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { ScriptVersionEntity } from './entities/script-version.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ScriptsService } from './scripts.service';
import { QueryScriptVersionDto } from './dto/query-script-version.dto';
import { CreateScriptVersionDto } from './dto/create-script-version.dto';
import { UpdateScriptVersionDto } from './dto/update-script-version.dto';
import { ScriptVersionNotFoundError } from './errors/script-version-not-found.error';
import { ScriptVersionStatusEnum } from './enums/script-version-status.enum';
import { NonDraftScriptVersionUpdateError } from './errors/non-draft-script-version-update.error';
import { ScriptSourceEntity } from './entities/script-source.entity';
import { ScriptContentEntity } from './entities/script-content.entity';
import { ScriptRunEntity } from './entities/script-run.entity';
import { NonDraftScriptVersionPublishError } from './errors/non-draft-script-version-publish.error';
import { Require } from 'src/shared/types/require';
import { PaginatedScriptVersionDto } from './dto/paginated-script-version.dto';

@Injectable()
export class ScriptsVersionsService {
  public constructor(
    @InjectRepository(ScriptVersionEntity)
    private readonly scriptsVersionsRepo: Repository<ScriptVersionEntity>,
    private readonly scriptsService: ScriptsService,
  ) {}

  public async create(userId: string, scriptId: string, dto: CreateScriptVersionDto): Promise<ScriptVersionEntity> {
    const script = await this.scriptsService.findById(userId, scriptId);

    const lastVersion = await this.findLastVersion(userId, scriptId);
    await this.archiveAll(userId, scriptId);

    const version = this.scriptsVersionsRepo.create({
      ...dto,
      versionNumber: (lastVersion?.versionNumber ?? 0) + 1,
      status: ScriptVersionStatusEnum.Draft,
      script
    });

    return this.scriptsVersionsRepo.save(version);
  }

  public findAll(userId: string, scriptId: string, dto: QueryScriptVersionDto): Promise<ScriptVersionEntity[] | PaginatedScriptVersionDto> {
    return dto.pagination
      // Typescript is dumb enough to not take narrowing into account here
      ? this.findAllPaginated(userId, scriptId, <Require<QueryScriptVersionDto, 'pagination'>>dto)
      : this.findAllNonPaginated(userId, scriptId, dto);
  }

  public findAllNonPaginated(userId: string, scriptId: string, dto: QueryScriptVersionDto): Promise<ScriptVersionEntity[]> {
    const where = this.parseWhere(userId, scriptId, dto);
    const relations = this.parseRelations(userId, scriptId, dto);
    const order = this.parseOrder(userId, scriptId, dto);
    
    return this.scriptsVersionsRepo.find({ where, order, relations });
  }

  public async findAllPaginated(userId: string, scriptId: string, dto: Require<QueryScriptVersionDto, 'pagination'>): Promise<PaginatedScriptVersionDto> {
    const where = this.parseWhere(userId, scriptId, dto);
    const relations = this.parseRelations(userId, scriptId, dto);
    const order = this.parseOrder(userId, scriptId, dto);
    const [take, skip] = this.parsePagination(dto.pagination);

    const [data, totalItems] = await this.scriptsVersionsRepo.findAndCount({ where, order, relations, take, skip });
    return {
      data,
      metadata: {
        page: dto.pagination.page,
        limit: dto.pagination.limit,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / dto.pagination.limit)
      }
    }
  }

  public async findById(userId: string, scriptId: string, versionId: string): Promise<ScriptVersionEntity> {
    const version = await this.scriptsVersionsRepo.findOne({
      where: {
        id: versionId,
        script: {
          id: scriptId,
          owner: {
            id: userId
          }
        }
      },
      relations: {
        script: {
          owner: true
        },
        content: true,
        source: true
      }
    });

    if(!version) {
      throw new ScriptVersionNotFoundError(userId, scriptId, versionId);
    }

    return version;
  }

  public async findOneByUsersVersionId(userId: string, versionId: string): Promise<ScriptVersionEntity> {
    const version = await this.scriptsVersionsRepo.findOne({
      where: {
        id: versionId,
        script: {
          owner: {
            id: userId
          }
        }
      },
      relations: {
        script: {
          owner: true
        },
        content: true,
        source: true
      }
    });

    if(!version) {
      throw new ScriptVersionNotFoundError(userId, undefined, versionId);
    }

    return version;
  }

  public async update(userId: string, scriptId: string, versionId: string, dto: UpdateScriptVersionDto): Promise<ScriptVersionEntity> {
    const version = await this.findById(userId, scriptId, versionId);

    if(version.status != ScriptVersionStatusEnum.Draft) {
      throw new NonDraftScriptVersionUpdateError(userId, scriptId, versionId, version.status);
    }

    const result = await this.scriptsVersionsRepo.save({
      ...version,
      ...dto
    });

    return result;
  }

  public async fork(userId: string, scriptId: string, versionId: string): Promise<ScriptVersionEntity> {
    const version = await this.findById(userId, scriptId, versionId);

    const lastVersion = await this.findLastVersion(userId, scriptId);
    await this.archiveAll(userId, scriptId);

    const result = this.scriptsVersionsRepo.create({
      ...version,
      id: undefined,
      status: ScriptVersionStatusEnum.Draft,
      versionNumber: (lastVersion?.versionNumber ?? 0) + 1
    });

    return this.scriptsVersionsRepo.save(result);
  }

  public async publish(userId: string, scriptId: string, versionId: string): Promise<ScriptVersionEntity> {
    const version = await this.findById(userId, scriptId, versionId);

    if(version.status != ScriptVersionStatusEnum.Draft) {
      throw new NonDraftScriptVersionPublishError(userId, scriptId, versionId, version.status);
    }

    const result = await this.scriptsVersionsRepo.save({
      ...version,
      status: ScriptVersionStatusEnum.Published
    });

    return result;
  }

  public async remove(userId: string, scriptId: string, versionId: string): Promise<void> {
    const version = await this.findById(userId, scriptId, versionId);
    await this.scriptsVersionsRepo.delete(version.id);
  }

  private findLastVersion(userId: string, scriptId: string): Promise<ScriptVersionEntity | null> {
    return this.scriptsVersionsRepo.findOne({
      where: {
        script: {
          id: scriptId,
          owner: {
            id: userId
          }
        }
      },
      relations: {
        script: {
          owner: true
        }
      },
      order: {
        versionNumber: { 
          direction: 'DESC'
        }
      }
    });
  }

  private async archiveAll(userId: string, scriptId: string): Promise<void> {
    await this.scriptsVersionsRepo.update({ 
      script: { 
        id: scriptId, 
        owner: { 
          id: userId 
        } 
      }
    }, 
    { 
      status: ScriptVersionStatusEnum.Archieved 
    });
  }

  private parseRelations(userId: string, scriptId: string, dto: QueryScriptVersionDto): FindOptionsRelations<ScriptVersionEntity> {
    const { source, content, runId } = dto.filtering || {};
    const relations: FindOptionsRelations<ScriptVersionEntity> = {};

    if(content) {
      if(content.engineVersion != null) {
        relations.content = true;
      }
    }

    if(source) {
      if(source.format) {
        relations.source = true;
      }
    }

    if(runId) {
      relations.runs = true;
    }

    return {
      script: {
        owner: true
      },
      ...relations
    }
  }

  private parseWhere(userId: string, scriptId: string, dto: QueryScriptVersionDto): FindOptionsWhere<ScriptVersionEntity> {
    // NOTE: Intellisense and Typescript loses type shape context
    // each "object level" needs to be casted
    
    const { source, content, runId } = dto.filtering || {};
    const filters: FindOptionsWhere<ScriptVersionEntity> = {};
    
    if(content) {
      if(content.engineVersion != null) {
        filters.content ??= {};
        (<FindOptionsWhere<ScriptContentEntity>>
          filters.content
        ).engineVersion = content.engineVersion;
      }
    }

    if(source) {
      if(source.format) {
        filters.source ??= {};
        (<FindOptionsWhere<ScriptSourceEntity>>
          filters.source
        ).format = source.format;
      }
    }

    if(runId) {
      filters.runs ??= {};
      (<FindOptionsWhere<ScriptRunEntity>>
        filters.runs
      ).id = runId;
    }

    return {
      script: {
        id: scriptId,
        owner: {
          id: userId
        }
      },
      ...filters
    };
  }

  private parseOrder(userId: string, scriptId: string, dto: QueryScriptVersionDto): FindOptionsOrder<ScriptVersionEntity> {
    // NOTE: Intellisense and Typescript loses type shape context
    // each "object level" needs to be casted
    
    const order: FindOptionsOrder<ScriptVersionEntity> = {};

    if(dto.sorting) {
      if(dto.sorting.sortBy.startsWith('source')) {
        const key = dto.sorting.sortBy.replace('source', '');
        order.source ??= <FindOptionsOrder<ScriptSourceEntity>>{};
        order.source[key] = { direction: dto.sorting.order };
      } else if(dto.sorting.sortBy.startsWith('content')) {
        const key = dto.sorting.sortBy.replace('content', '');
        order.content ??= <FindOptionsOrder<ScriptContentEntity>>{};
        order.content[key] = { direction: dto.sorting.order };
      } else {
        order[dto.sorting.sortBy] = { direction: dto.sorting.order };
      }
    }

    return order;
  }

  private parsePagination(dto: NonNullable<QueryScriptVersionDto['pagination']>): [number, number] {
    return [dto.limit, (dto.page - 1) * dto.limit];
  }
}
