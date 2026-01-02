import { Type } from "class-transformer";
import columnDateOptions from "src/shared/decorators/column-date-options";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ScriptEntity } from "./script.entity";
import { ScriptVersionStatusEnum } from "../enums/script-version-status.enum";
import { ScriptContentEntity } from "./script-content.entity";
import { ScriptSourceEntity } from "./script-source.entity";
import { ScriptRunEntity } from "./script-run.entity";
import { columnEnumType } from "src/shared/decorators/column-enum-type";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);
const enumType = columnEnumType(process.env.DB_TYPE!);

@Entity({ name: 'script-version' })
export class ScriptVersionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ScriptEntity, (script) => script.versions)
  script: ScriptEntity;

  @OneToOne(() => ScriptContentEntity, (content) => content.scriptVersion, {
    cascade: true
  })
  content: ScriptContentEntity;

  @OneToOne(() => ScriptSourceEntity, (content) => content.scriptVersion, {
    cascade: true
  })
  source: ScriptSourceEntity;

  @OneToMany(() => ScriptRunEntity, (run) => run.scriptVersion)
  runs: ScriptRunEntity[];

  @Column()
  versionNumber: number;

  @Column({ type: enumType, enum: ScriptVersionStatusEnum, default: ScriptVersionStatusEnum.Draft })
  status: ScriptVersionStatusEnum;

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;
}
