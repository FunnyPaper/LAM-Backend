import { Type } from "class-transformer";
import columnDateOptions from "src/shared/decorators/column-date-options";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ScriptRunEntity } from "./script-run.entity";
import { columnJsonType } from "src/shared/decorators/column-json-type";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);
const jsonType = columnJsonType(process.env.DB_TYPE!);

@Entity({ name: 'script-run-result' })
export class ScriptRunResultEntity {
  @PrimaryColumn('uuid')
  scriptRunId: string;

  @OneToOne(() => ScriptRunEntity, (run) => run.result, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'scriptRunId' })
  scriptRun: ScriptRunEntity;

  @Column({ type: jsonType, nullable: true })
  data?: Record<string, any>;

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;
}
