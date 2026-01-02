import { Type } from "class-transformer";
import columnDateOptions from "src/shared/decorators/column-date-options";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ScriptVersionEntity } from "./script-version.entity";
import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";
import { EnvEntity } from "src/env/entities/env.entity";
import { columnJsonType } from "src/shared/decorators/column-json-type";
import { ScriptRunResultEntity } from "./script-run-result.entity";
import { columnEnumType } from "src/shared/decorators/column-enum-type";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);
const jsonType = columnJsonType(process.env.DB_TYPE!);
const enumType = columnEnumType(process.env.DB_TYPE!);

@Entity({ name: 'script-run' })
export class ScriptRunEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: enumType, enum: ScriptRunStatusEnum, default: ScriptRunStatusEnum.Queued })
  status: ScriptRunStatusEnum;

  @ManyToOne(() => ScriptVersionEntity, (version) => version.runs, { nullable: true })
  scriptVersion: ScriptVersionEntity | null;

  @Column({ type: jsonType })
  scriptVersionSnapshot: Record<string, any>;

  @ManyToOne(() => EnvEntity, (env) => (env.runs), { nullable: true })
  env: EnvEntity | null;

  @Column({ type: jsonType })
  envSnapshot: Record<string, any> | null;

  @OneToOne(() => ScriptRunResultEntity, (content) => content.scriptVersion, {
    cascade: true
  })
  result: ScriptRunResultEntity;

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;

  @Column(dateOptions)
  @Type(() => Date)
  finishedAt: Date;
}
