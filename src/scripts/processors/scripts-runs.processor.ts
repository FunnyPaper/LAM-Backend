import PQueue from "p-queue";
import { Injectable } from "@nestjs/common";
import { ScriptsRunsGrpcClientService } from "../scripts-runs-grpc-client.service";
import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";
import { JobEventType, JobStatus, StatusType } from "src/proto/worker";
import { ScriptRunGateway } from "../gateways/script-run.gateway";
import { InjectRepository } from "@nestjs/typeorm";
import { ScriptRunEntity } from "../entities/script-run.entity";
import { Repository } from "typeorm";
import { ScriptRunResultEntity } from "../entities/script-run-result.entity";
import { AuthService } from "src/auth/auth.service";

const statusMapper = {
    [JobStatus.CANCELLED]: ScriptRunStatusEnum.Cancelled,
    [JobStatus.COMPLETED]: ScriptRunStatusEnum.Succeeded,
    [JobStatus.FAILED]: ScriptRunStatusEnum.Failed,
    [JobStatus.RUNNING]: ScriptRunStatusEnum.Running,
    [JobStatus.STARTED]: ScriptRunStatusEnum.Running
};

@Injectable()
export class ScriptsRunsProcessor {

    private queue: PQueue;
    private pendingRuns: Set<string>;

    constructor(
        @InjectRepository(ScriptRunEntity)
        private readonly scriptsRunsRepo: Repository<ScriptRunEntity>,

        @InjectRepository(ScriptRunResultEntity)
        private readonly scriptsRunsResultsRepo: Repository<ScriptRunResultEntity>,

        private readonly grpcClientService: ScriptsRunsGrpcClientService,
        private readonly gateway: ScriptRunGateway,
        private readonly authService: AuthService,
    ) {
        this.queue = new PQueue({
            concurrency: parseInt(process.env.SCRIPT_RUNS_CONCURRENCY ?? "1")
        });

        this.pendingRuns = new Set();
    }

    enqueueStartJob(
        runId: string,
        userId: string,
        script: Record<string, any>,
        env: Record<string, any> | undefined,
    ) {
        this.pendingRuns.add(runId);
        const job = this.queue.add(() => this.startJob(runId, userId, script, env));
        return job;
    }

    async startJob(
        runId: string,
        userId: string,
        script: Record<string, any>,
        env: Record<string, any> | undefined
    ) {
        if(!this.pendingRuns.has(runId)) return; 

        const token = this.authService.createGrpcToken(runId, userId);
        const stream = this.grpcClientService.startJob(runId, script, env, token);

        await new Promise<void>((resolve) => {
            stream.subscribe({
                next: async (event) => {
                    const currentRun = await this.scriptsRunsRepo.findOne({
                        where: { id: runId },
                        relations: { result: true }
                    });

                    switch (event.type) {
                        case JobEventType.STATUS_CHANGE: {
                            const status = event.status!;
                            currentRun!.status = statusMapper[status];

                            await this.scriptsRunsRepo.save(currentRun!);

                            this.gateway.emitRunEvent(runId, {
                                type: "status",
                                status: statusMapper[status]
                            });
                            break;
                        }
                        case JobEventType.RESULT_UPDATE: {
                            const result = this.scriptsRunsResultsRepo.create(currentRun!.result!);

                            switch (event.payload!.type) {
                                case StatusType.PARTIAL:
                                    result.data = {
                                        ...currentRun?.result?.data,
                                        ...event.payload?.data
                                    };
                                    break;
                                case StatusType.FULL:
                                    result.data = event.payload?.data ?? {};
                                    break;
                            }

                            void this.scriptsRunsResultsRepo.save(result);

                            this.gateway.emitRunEvent(runId, {
                                type: "resultUpdate",
                                change: {
                                    type: event.payload!.type as unknown as "partial" | "full",
                                    data: event.payload!.data!
                                }
                            });
                            break;
                        }
                        case JobEventType.LOG: {
                            this.gateway.emitRunEvent(runId, {
                                type: "log",
                                log: {
                                    type: event.log!.type as unknown as "info" | "warn" | "error",
                                    message: event.log!.message
                                }
                            });
                            break;
                        }
                    }
                    return event;
                },

                error: (err) => {
                    this.gateway.emitRunEvent(runId, {
                        type: "status",
                        status: ScriptRunStatusEnum.Failed
                    });
                    resolve();
                },
                complete: resolve
            });

        });

        this.pendingRuns.delete(runId);

        return runId;
    }

    async cancelJob(runId: string, token: string) {
        if (this.pendingRuns.has(runId)) {
            await new Promise<void>((resolve) => {
                this.grpcClientService.cancelJob(runId, token).subscribe({
                    error: () => {
                        this.gateway.emitRunEvent(runId, {
                            type: "status",
                            status: ScriptRunStatusEnum.Failed
                        });
                        resolve();
                    },
                    complete: () => {
                        this.gateway.emitRunEvent(runId, {
                            type: "status",
                            status: ScriptRunStatusEnum.Cancelled
                        });
                        resolve();
                    }
                });
            });
        }

        this.pendingRuns.delete(runId);

        return runId;
    }
}