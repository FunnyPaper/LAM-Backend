import { Type } from "class-transformer";
import columnDateOptions from "src/shared/decorators/column-date-options";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ScriptVersionEntity } from "./script-version.entity";
import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";
import { EnvEntity } from "src/env/entities/env.entity";
import { columnJsonType } from "src/shared/decorators/column-json-type";
import { ScriptRunResultEntity } from "./script-run-result.entity";
import { columnEnumType } from "src/shared/decorators/column-enum-type";
import { UserEntity } from "src/users/entities/user.entity";
import { EnvSnapshotDto } from "../dto/env-snapshot.dto";
import { ScriptVersionSnapshotDto } from "../dto/script-versions-snapshot.dto";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);
const jsonType = columnJsonType(process.env.DB_TYPE!);
const enumType = columnEnumType(process.env.DB_TYPE!);

@Entity({ name: 'script-run' })
export class ScriptRunEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: enumType, enum: ScriptRunStatusEnum, default: ScriptRunStatusEnum.Queued })
  status: ScriptRunStatusEnum;

  @ManyToOne(() => ScriptVersionEntity, (version) => version.runs, { 
    nullable: true,
    onDelete: 'SET NULL' 
  })
  scriptVersion?: ScriptVersionEntity;

  @Column({ type: jsonType })
  scriptVersionSnapshot: ScriptVersionSnapshotDto;

  @ManyToOne(() => EnvEntity, (env) => (env.runs), { 
    nullable: true, 
    onDelete: 'SET NULL'
  })
  env?: EnvEntity;

  @Column({ 
    type: jsonType, 
    nullable: true 
  })
  envSnapshot?: EnvSnapshotDto;

  @OneToOne(() => ScriptRunResultEntity, (content) => content.scriptRun, {
    nullable: true,
    cascade: true
  })
  result?: ScriptRunResultEntity;

  @ManyToOne(() => UserEntity, (user) => user.scriptRuns, {
    onDelete: 'CASCADE'
  })
  createdBy: UserEntity;

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;

  @Column({ 
    ...dateOptions,
    nullable: true 
  })
  @Type(() => Date)
  finishedAt: Date;
}
