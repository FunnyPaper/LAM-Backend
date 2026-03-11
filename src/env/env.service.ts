import { Injectable } from '@nestjs/common';
import { CreateEnvDto } from './dto/create-env.dto';
import { UpdateEnvDto } from './dto/update-env.dto';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Like, Repository } from 'typeorm';
import { EnvEntity } from './entities/env.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { EnvNotFoundError } from './errors/env-not-found.error';
import { QueryEnvDto } from './dto/query-script.dto';
import { Require } from 'src/shared/types/require';
import { PaginatedEnvDto } from './dto/paginated-env.dto';

@Injectable()
export class EnvService {
  public constructor(
    @InjectRepository(EnvEntity)
    private envRepo: Repository<EnvEntity>,
    private usersService: UsersService
  ) {}

  public async create(userId: string, dto: CreateEnvDto): Promise<EnvEntity> {
    const owner = await this.usersService.findById(userId);

    const env = this.envRepo.create({
      ...dto,
      owner
    });
    
    return this.envRepo.save(env);
  }

  public async update(userId: string, envId: string, dto: UpdateEnvDto): Promise<EnvEntity> {
    const env = await this.findById(userId, envId);

    const result = await this.envRepo.save({
      ...env,
      ...dto
    });

    return result;
  }

  public tryFindAll(userId: string, dto: QueryEnvDto): Promise<EnvEntity[] | PaginatedEnvDto> {
    return dto.pagination
      ? this.findAllPaginated(userId, <Require<QueryEnvDto, 'pagination'>>dto)
      : this.findAllNonPaginated(userId, dto)
  }

  public findAllNonPaginated(userId: string, dto: QueryEnvDto): Promise<EnvEntity[]> {
    const where = this.parseWhere(userId, dto);
    const relations = this.parseRelations(userId, dto);
    const order = this.parseOrder(userId, dto);
    
    return this.envRepo.find({ where, order, relations });
  }

  public async findAllPaginated(userId: string, dto: Require<QueryEnvDto, 'pagination'>): Promise<PaginatedEnvDto> {
    const where = this.parseWhere(userId, dto);
    const relations = this.parseRelations(userId, dto);
    const order = this.parseOrder(userId, dto);
    const [take, skip] = this.parsePagination(dto.pagination);

    const [data, totalItems] = await this.envRepo.findAndCount({ where, order, relations, take, skip });
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

  public tryFindById(userId: string, envId: string): Promise<EnvEntity | null> {
    return this.envRepo.findOne({
      where: {
        id: envId,
        owner: {
          id: userId
        }
      },
    });
  }

  public async findById(userId: string, envId: string): Promise<EnvEntity> {
    const env = await this.tryFindById(userId, envId);

    if (!env) {
      throw new EnvNotFoundError(userId, envId);
    }

    return env;
  }

  public async findByIdWithOwner(userId: string, envId: string): Promise<EnvEntity> {
    const env = await this.envRepo.findOne({
      where: {
        id: envId,
        owner: {
          id: userId
        }
      },
      relations: {
        owner: true
      }
    });

    if (!env) {
      throw new EnvNotFoundError(userId, envId);
    }

    return env;
  }

  public async remove(userId: string, envId: string) {
    const env = await this.findById(userId, envId);
    await this.envRepo.delete(env.id);
  }

  private parseRelations(userId: string, dto: QueryEnvDto): FindOptionsRelations<EnvEntity> {
    return {
      owner: true,
    };
  }

  private parseWhere(userId: string, dto: QueryEnvDto): FindOptionsWhere<EnvEntity> {
    // NOTE: Intellisense and Typescript loses type shape context
    // each "object level" needs to be casted
    
    const { name } = dto.filtering || {};
    const filters: FindOptionsWhere<EnvEntity> = {};

    if(name) {
      filters.name = Like(`%${name}%`);
    }

    return {
      owner: {
        id: userId
      },
      ...filters
    }
  }

  private parseOrder(userId: string, dto: QueryEnvDto): FindOptionsOrder<EnvEntity> {
    const order: FindOptionsOrder<EnvEntity> = {};
    
    if(dto.sorting) {
      order[dto.sorting.sortBy] = {
        direction: dto.sorting.order
      }
    }

    return order;
  }

  private parsePagination(dto: NonNullable<QueryEnvDto['pagination']>): [number, number] {
    return [dto.limit, (dto.page - 1) * dto.limit];
  }
}
