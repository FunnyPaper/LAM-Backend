import { Injectable } from '@nestjs/common';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Like, Repository } from 'typeorm';
import { ScriptEntity } from './entities/script.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { QueryScriptDto } from './dto/query-script.dto';
import { ScriptNotFoundError } from './errors/script-not-found.error';
import { ScriptVersionEntity } from './entities/script-version.entity';
import { ScriptRunEntity } from './entities/script-run.entity';
import { Require } from 'src/shared/types/require';
import { PaginatedScriptDto } from './dto/paginated-script.dto';

@Injectable()
export class ScriptsService {
  public constructor(
    @InjectRepository(ScriptEntity)
    private readonly scriptsRepo: Repository<ScriptEntity>,
    private readonly usersService: UsersService
  ) {}
  
  public async create(userId: string, createScriptDto: CreateScriptDto): Promise<ScriptEntity> {
    const user = await this.usersService.findById(userId);

    const script = this.scriptsRepo.create({
      ...createScriptDto,
      owner: user
    });

    return this.scriptsRepo.save(script);
  }

  public findAll(userId: string, dto: QueryScriptDto): Promise<ScriptEntity[] | PaginatedScriptDto> {
    return dto.pagination
      // Typescript is dumb enough to not take narrowing into account here
      ? this.findAllPaginated(userId, <Require<QueryScriptDto, 'pagination'>>dto)
      : this.findAllNonPaginated(userId, dto);
  }

  public findAllNonPaginated(userId: string, dto: QueryScriptDto): Promise<ScriptEntity[]> {
    const where = this.parseWhere(userId, dto);
    const relations = this.parseRelations(userId, dto);
    const order = this.parseOrder(userId, dto);
    
    return this.scriptsRepo.find({ where, order, relations });
  }

  public async findAllPaginated(userId: string, dto: Require<QueryScriptDto, 'pagination'>): Promise<PaginatedScriptDto> {
    const where = this.parseWhere(userId, dto);
    const relations = this.parseRelations(userId, dto);
    const order = this.parseOrder(userId, dto);
    const [take, skip] = this.parsePagination(dto.pagination);

    const [data, totalItems] = await this.scriptsRepo.findAndCount({ where, order, relations, take, skip });
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

  public async findById(userId: string, scriptId: string): Promise<ScriptEntity> {
    const script = await this.scriptsRepo.findOne({
      where: { 
        id: scriptId,
        owner: {
          id: userId
        } 
      },
      relations: {
        owner: true
      }
    });

    if(!script) {
      throw new ScriptNotFoundError(userId, scriptId);
    }

    return script;
  }

  public async update(userId: string, scriptId: string, dto: UpdateScriptDto): Promise<ScriptEntity> {
    const script = await this.findById(userId, scriptId);

    const result = await this.scriptsRepo.save({
      ...script,
      ...dto
    })

    return result;
  }

  public async remove(userId: string, scriptId: string): Promise<void> {
    const script = await this.findById(userId, scriptId);
    await this.scriptsRepo.delete(script.id);
  }

  private parseRelations(userId: string, dto: QueryScriptDto): FindOptionsRelations<ScriptEntity> {
    const { scriptVersionId, runId } = dto.filtering || {};
    const relations: FindOptionsRelations<ScriptEntity> = {};

    if(scriptVersionId) {
      relations.versions = true;
    }

    if(runId) {
      relations.versions = { runs: true };
    }

    return {
      owner: true,
      ...relations
    };
  }

  private parseWhere(userId: string, dto: QueryScriptDto): FindOptionsWhere<ScriptEntity> {
    // NOTE: Intellisense and Typescript loses type shape context
    // each "object level" needs to be casted
    
    const { name, scriptVersionId, runId } = dto.filtering || {};
    const filters: FindOptionsWhere<ScriptEntity> = {};

    if(name) {
      filters.name = Like(`%${name}%`);
    }

    if(scriptVersionId) {
      filters.versions ??= {};
      (<FindOptionsWhere<ScriptVersionEntity>>
        filters.versions
      ).id = scriptVersionId;
    }

    if(runId) {
      filters.versions ??= {};
      (<FindOptionsWhere<ScriptVersionEntity>>
        filters.versions
      ).runs ??= {};

      (<FindOptionsWhere<ScriptRunEntity>>
        (<FindOptionsWhere<ScriptVersionEntity>>
        filters.versions
      ).runs).id = runId;
    }

    return {
      owner: {
        id: userId
      },
      ...filters
    }
  }

  private parseOrder(userId: string, dto: QueryScriptDto): FindOptionsOrder<ScriptEntity> {
    const order: FindOptionsOrder<ScriptEntity> = {};
    
    if(dto.sorting) {
      order[dto.sorting.sortBy] = {
        direction: dto.sorting.order
      }
    }

    return order;
  }

  private parsePagination(dto: NonNullable<QueryScriptDto['pagination']>): [number, number] {
    return [dto.limit, (dto.page - 1) * dto.limit];
  }
}
