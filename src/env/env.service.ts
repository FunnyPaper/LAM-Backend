import { Injectable } from '@nestjs/common';
import { CreateEnvDto } from './dto/create-env.dto';
import { UpdateEnvDto } from './dto/update-env.dto';
import { Repository } from 'typeorm';
import { EnvEntity } from './entities/env.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { EnvNotFoundError } from './errors/env-not-found.error';

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
    await this.usersService.findById(userId);

    const env = await this.envRepo.save({
      id: envId,
      ...dto
    });

    return env;
  }

  public tryFindAll(userId: string): Promise<EnvEntity[]> {
    return this.envRepo.find({ 
      where: { 
        owner: { 
          id: userId
        } 
      }
    });
  }

  public async findById(userId: string, envId: string): Promise<EnvEntity> {
    const env = await this.envRepo.findOne({
      where: {
        id: envId,
        owner: {
          id: userId
        }
      },
    });

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
}
