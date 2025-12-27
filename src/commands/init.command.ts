import { Command, CommandRunner } from "nest-commander";
import { UsersService } from '../users/users.service';

@Command({
  name: 'init'
})
export class InitCommand extends CommandRunner {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async run(): Promise<void> {
    const admin = await this.usersService.tryFindAdmin();
    if(admin) {
      console.log('Initial admin already exists. Skipping...');
      return;
    }

    await this.usersService.createSuperAdmin();
  }
}