import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { Role } from '../app.roles';
import { RefreshTokenService } from '../tokens/refresh-token.service';
import { HashService } from 'src/shared/providers/hash.service';
import { UserNotFoundError } from 'src/users/errors/user-not-found.error';
import { UsernameTakenError } from 'src/users/errors/username-taken.error';
import { InsufficientPrivilegesError } from 'src/auth/errors/insufficient-privileges.error';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private tokensService: RefreshTokenService,
    private hashService: HashService
  ) { }

  public async findAll(): Promise<UserDto[]> {
    return this.usersRepository.find();
  }

  public async findById(id: string) {
    const user = await this.tryFindById(id);
    if(!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
  
  public tryFindById(id: string) {
    return this.usersRepository.findOne({ where: { id }});
  }

  public async tryFindByIdWithRefreshToken(id: string) {
    return this.usersRepository.findOne({ 
      where: { id }, 
      relations: { refreshToken: true }
    });
  }

  public tryFindOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async tryCreate(config: {
    username: string,
    password: string,
    role: Role
  }) {
    const { username, password, role } = config;

    const userExists: boolean = !!(await this.tryFindOneByUsername(username));
    if(userExists) {
      throw new UsernameTakenError(username);
    }

    const hashed = await this.hashService.hash(password);
    const user = this.usersRepository.create({ 
      username,
      password: hashed, 
      role 
    });
    
    return this.usersRepository.save(user);
  }

  async tryCreateWithSupervisor(config: {
    creator: { id: string, username: string, roles: Role[] },
    username: string,
    password: string,
    role: Role
  }) {
    const { creator, role } = config;

    if(!creator?.roles.includes(Role.ADMIN) && role === Role.ADMIN) {
      throw new InsufficientPrivilegesError(creator?.id, Role.ADMIN, creator.roles[0]);
    }

    return this.tryCreate(config);
  }

  async createSuperAdmin() {
    return this.tryCreate({ 
      username: process.env.INITIAL_ADMIN_USERNAME!,
      password: process.env.INITIAL_ADMIN_PASSWORD!, 
      role: Role.ADMIN 
    });
  }

  async tryFindAdmin() {
    return this.usersRepository.findOne({
      where: { role: Role.ADMIN }
    })
  }

  async clearRefreshToken(id: string) {
    const user = await this.usersRepository.findOne({ where: { id }});

    if(user) {
      user.refreshToken = null;
      await this.usersRepository.update(user.id, user);
    }
  }

  async clearExpiredRefreshTokens() {
    const users = await this.usersRepository.find({ 
      relations: ['refreshToken'],
      where: {
        refreshToken: { 
          expiresAt: LessThan(new Date())
        }
      } 
    });

    for(const user of users) {
      const id = user.refreshToken?.id;
      if(id) {
        user.refreshToken = null;
        await this.usersRepository.update(user.id, user);
        await this.tokensService.removeById(id);
      }
    }

    await this.tokensService.removeExpired();

    return users.length;
  }
}
