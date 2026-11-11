import { PartialType } from '@nestjs/swagger';
import { CreateEnvDto } from './create-env.dto';

export class UpdateEnvDto extends PartialType(CreateEnvDto) {}
