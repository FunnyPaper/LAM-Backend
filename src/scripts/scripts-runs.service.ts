import { Injectable } from '@nestjs/common';
import { CreateScriptRunDto } from './dto/create-script-run.dto';
import { QueryScriptRunDto } from './dto/query-script-run.dto';
import { ReexecuteScriptRunDto } from './dto/reexecute-script-run.dto';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ScriptRunEntity } from './entities/script-run.entity';
import { ScriptsVersionsService } from './scripts-versions.service';
import { EnvService } from 'src/env/env.service';
import { EnvEntity } from 'src/env/entities/env.entity';
import { plainToInstance } from 'class-transformer';
import { ScriptVersionSnapshotDto } from './dto/script-versions-snapshot.dto';
import { EnvSnapshotDto } from './dto/env-snapshot.dto';
import { ScriptRunNotFoundError } from './errors/script-run-not-found.error';
import { ScriptRunStatusEnum } from './enums/script-run-status.enum';
import { ScriptRunRemoveStatusError } from './errors/script-run-remove-status.error';
import { ScriptRunCancelStatusError } from './errors/script-run-cancel-status.error';
import { ScriptRunReexecuteStatusError } from './errors/script-run-reexecute-status.error';
import { ScriptVersionEntity } from './entities/script-version.entity';
import { ScriptEntity } from './entities/script.entity';
import { Require } from 'src/shared/types/require';
import { PaginatedScriptRunDto } from './dto/paginated-script-run.dto';
import { ScriptRunGateway } from './gateways/script-run.gateway';
import { ScriptsRunsGrpcClientService } from './scripts-runs-grpc-client.service';
import { firstValueFrom } from 'rxjs';
import { ScriptRunResultEntity } from './entities/script-run-result.entity';
import { ScriptVersionStatusEnum } from './enums/script-version-status.enum';
import { ScriptRunCreateFromUnpublishedError } from './errors/script-run-create-from-unpublished.error';
import { AuthService } from 'src/auth/auth.service';
import { JobEventType } from 'src/proto/worker';
import { RunEvent } from './gateways/run.event';

@Injectable()
export class ScriptsRunsService {
  public constructor(
    @InjectRepository(ScriptRunEntity)
    private readonly scriptsRunsRepo: Repository<ScriptRunEntity>,
    @InjectRepository(ScriptRunResultEntity)
    private readonly scriptsRunsResultsRepo: Repository<ScriptRunResultEntity>,
    private readonly scriptsVersionsService: ScriptsVersionsService,
    private readonly usersService: UsersService,
    private readonly envService: EnvService,
    private readonly gateway: ScriptRunGateway,
    private readonly grpcClientService: ScriptsRunsGrpcClientService,
    private readonly authService: AuthService
  ) {}

  public async create(userId: string, dto: CreateScriptRunDto): Promise<ScriptRunEntity> {
    const user = await this.usersService.findById(userId);
    const scriptVersion = await this.scriptsVersionsService.findOneByUsersVersionId(userId, dto.scriptVersionId);

    if(scriptVersion.status != ScriptVersionStatusEnum.Published) {
      throw new ScriptRunCreateFromUnpublishedError(userId, scriptVersion.id, scriptVersion.status);
    }

    let env: EnvEntity | undefined;
    if(dto.envId) {
      env = await this.envService.findById(userId, dto.envId);
    }

    const scriptRunResult = this.scriptsRunsResultsRepo.create({ data: {} });
    const scriptRun = this.scriptsRunsRepo.create({
      ...dto,
      env: env,
      envSnapshot: env && plainToInstance(EnvSnapshotDto, env),
      scriptVersion: scriptVersion,
      scriptVersionSnapshot: plainToInstance(ScriptVersionSnapshotDto, scriptVersion),
      createdBy: user,
      result: scriptRunResult
    });

    const run = await this.scriptsRunsRepo.save(scriptRun);
    
    const token = this.authService.createGrpcToken(run.id, userId);
    const stream = this.grpcClientService.startJob(run.id, token);

    stream.subscribe({
      next: (event) => {
        const runId = run.id;
        switch(event.type) {
          case JobEventType.STATUS_CHANGE: {
            const status = event.status!
            // Recast status
            this.gateway.emitRunEvent(runId, { 
              type: 'status',
              status: status as unknown as ScriptRunStatusEnum
            });     
            break;
          }       
          case JobEventType.RESULT_UPDATE: {
            const run = this.scriptsRunsRepo.findOne({ where: { id: runId }, relations: { result: true }});

            void run.then(r => {
              const result = this.scriptsRunsResultsRepo.create(r!.result!);

              result.data = {
                ...r?.result?.data,
                ...event.payload
              }

              void this.scriptsRunsResultsRepo.save(result);

              this.gateway.emitRunEvent(runId, {
                type: 'progress',
                progress: 0
              });
            });

            break;
          }
          case JobEventType.LOG:
            this.gateway.emitRunEvent(runId, {
              type: 'log',
              message: event.log!.message,
              ts: event.log!.type
            })
            break;
        }
      },
      error: (err) => {
        this.gateway.emitRunEvent(run.id, {
          type: 'status',
          status: ScriptRunStatusEnum.Failed
        });
      },
      complete: () => {
        this.gateway.emitRunEvent(run.id, {
          type: 'status',
          status: ScriptRunStatusEnum.Succeeded
        });
      }
    })

    return run;
  }

  public findAll(userId: string, dto: QueryScriptRunDto): Promise<ScriptRunEntity[] | PaginatedScriptRunDto> {
    return dto.pagination
      // Typescript is dumb enough to not take narrowing into account here
      ? this.findAllPaginated(userId, <Require<QueryScriptRunDto, 'pagination'>>dto)
      : this.findAllNonPaginated(userId, dto);
  }

  public findAllNonPaginated(userId: string, dto: QueryScriptRunDto): Promise<ScriptRunEntity[]> {
    const where = this.parseWhere(userId, dto);
    const relations = this.parseRelations(userId, dto);
    const order = this.parseOrder(userId, dto);

    return this.scriptsRunsRepo.find({ where, order, relations });
  }

  public async findAllPaginated(
    userId: string, 
    dto: Require<QueryScriptRunDto, 'pagination'>
  ): Promise<PaginatedScriptRunDto> {
    const where = this.parseWhere(userId, dto);
    const relations = this.parseRelations(userId, dto);
    const order = this.parseOrder(userId, dto);
    const [take, skip] = this.parsePagination(dto.pagination);

    const [data, totalItems] = await this.scriptsRunsRepo.findAndCount({ where, order, relations, take, skip });
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

  public async findById(userId: string, scriptRunId: string): Promise<ScriptRunEntity> {
    const run = await this.scriptsRunsRepo.findOne({
      where: {
        id: scriptRunId,
        createdBy: {
          id: userId
        }
      },
      relations: {
        result: true,
        createdBy: true
      }
    });

    if(!run) {
      throw new ScriptRunNotFoundError(userId, scriptRunId);
    }

    return run;
  }

  public async remove(userId: string, scriptRunId: string): Promise<void> {
    const run = await this.findById(userId, scriptRunId);
    
    if(run.status == ScriptRunStatusEnum.Queued || run.status == ScriptRunStatusEnum.Running) {
      throw new ScriptRunRemoveStatusError(userId, scriptRunId, run.status);
    }

    await this.scriptsRunsRepo.delete(run.id);
  }

  public async cancel(userId: string, scriptRunId: string): Promise<ScriptRunEntity> {
    const run = await this.findById(userId, scriptRunId);

    if(!(run.status == ScriptRunStatusEnum.Queued || run.status == ScriptRunStatusEnum.Running)) {
      throw new ScriptRunCancelStatusError(userId, scriptRunId, run.status);
    }

    const token = this.authService.createGrpcToken(run.id, userId);
    await firstValueFrom(this.grpcClientService.cancelJob(run.id, token));

    this.gateway.emitRunEvent(run.id, {
      type: 'status',
      status: ScriptRunStatusEnum.Cancelled
    });

    return this.scriptsRunsRepo.save({
      ...run,
      status: ScriptRunStatusEnum.Cancelled
    });
  }

  public async reexecute(userId: string, scriptRunId: string, dto: ReexecuteScriptRunDto): Promise<ScriptRunEntity> {
    const run = await this.findById(userId, scriptRunId);

    if(run.status == ScriptRunStatusEnum.Queued || run.status == ScriptRunStatusEnum.Running) {
      throw new ScriptRunReexecuteStatusError(userId, scriptRunId, run.status);
    }

    const env = dto.envId && await this.envService.tryFindById(userId, dto.envId);

    const newRun = this.scriptsRunsRepo.create({
      ...run,
      id: undefined,
      result: undefined,
      status: ScriptRunStatusEnum.Queued,
      ...(env && {
        env: env,
        envSnapshot: env && plainToInstance(EnvSnapshotDto, env)
      })
    });

    return this.scriptsRunsRepo.save(newRun);
  }

  private parseRelations(userId: string, dto: QueryScriptRunDto): FindOptionsRelations<ScriptRunEntity> {
    const { scriptId, scriptVersionId } = dto.filtering || {};
    const relations: FindOptionsRelations<ScriptRunEntity> = {};

    if(scriptVersionId) {
      relations.scriptVersion = true;
    }

    if(scriptId) {
      relations.scriptVersion = { script: true };
    }

    return {
      createdBy: true,
      ...relations
    }
  }

  private parseWhere(userId: string, dto: QueryScriptRunDto): FindOptionsWhere<ScriptRunEntity> {
    // NOTE: Intellisense and Typescript loses type shape context
    // each "object level" needs to be casted
    
    const { scriptId, scriptVersionId } = dto.filtering || {};
    const filters: FindOptionsWhere<ScriptRunEntity> = {};
    
    if(scriptId) {
      filters.scriptVersion ??= {};
      (<FindOptionsWhere<ScriptVersionEntity>>
        filters.scriptVersion
      ).id = scriptVersionId;
    }

    if(scriptVersionId) {
      filters.scriptVersion ??= {};
      (<FindOptionsWhere<ScriptEntity>>
        (<FindOptionsWhere<ScriptVersionEntity>>
          filters.scriptVersion
        ).script
      ).id = scriptId
    }

    return {
      createdBy: {
        id: userId
      },
      ...filters
    };
  }

  private parseOrder(userId: string, dto: QueryScriptRunDto): FindOptionsOrder<ScriptRunEntity> {    
    const order: FindOptionsOrder<ScriptRunEntity> = {};

    if(dto.sorting) {
      order[dto.sorting.sortBy] = { direction: dto.sorting.order };
    }

    return order;
  }

  private parsePagination(dto: NonNullable<QueryScriptRunDto['pagination']>): [number, number] {
    return [dto.limit, (dto.page - 1) * dto.limit];
  }
}
