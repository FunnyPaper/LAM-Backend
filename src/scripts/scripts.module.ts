import { Module } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { ScriptsController } from './scripts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptEntity } from './entities/script.entity';
import { ScriptVersionEntity } from './entities/script-version.entity';
import { ScriptSourceEntity } from './entities/script-source.entity';
import { ScriptRunEntity } from './entities/script-run.entity';
import { ScriptRunResultEntity } from './entities/script-run-result.entity';
import { ScriptContentEntity } from './entities/script-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScriptEntity,
      ScriptVersionEntity,
      ScriptSourceEntity,
      ScriptRunEntity,
      ScriptRunResultEntity,
      ScriptContentEntity
    ])
  ],
  controllers: [ScriptsController],
  providers: [ScriptsService],
})
export class ScriptsModule {}
