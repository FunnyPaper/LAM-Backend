import { Metadata } from "@grpc/grpc-js";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { WORKER_SERVICE_NAME, WorkerServiceClient } from "src/proto/worker";

@Injectable()
export class ScriptsRunsGrpcClientService implements OnModuleInit{
  private serviceClient: WorkerServiceClient;

  constructor(
    @Inject(WORKER_SERVICE_NAME) private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.serviceClient = this.client.getService<WorkerServiceClient>(WORKER_SERVICE_NAME);
  }

  public startJob(jobId: string, token: string) {
    const metadata = new Metadata();
    metadata.set('authorization', `Bearer ${token}`)
    return this.serviceClient.startJob({ jobId }, metadata);
  }

  public cancelJob(jobId: string, token: string) {
    const metadata = new Metadata();
    metadata.set('authorization', `Bearer ${token}`)
    return this.serviceClient.cancelJob({ jobId }, metadata);
  }
}