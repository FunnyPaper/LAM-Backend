import { Type } from "class-transformer";
import columnDateOptions from "src/shared/decorators/column-date-options";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ScriptVersionEntity } from "./script-version.entity";
import { ScriptSourceFormatEnum } from "../enums/script-source-format.enum";
import { columnEnumType } from "src/shared/decorators/column-enum-type";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);
const enumType = columnEnumType(process.env.DB_TYPE!);

@Entity({ name: 'script-source' })
export class ScriptSourceEntity {
  @PrimaryColumn('uuid')
  scriptVersionId: string;

  @OneToOne(() => ScriptVersionEntity, (version) => version.source, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'scriptVersionId' })
  scriptVersion: ScriptVersionEntity;

  @Column({ type: enumType, enum: ScriptSourceFormatEnum })
  format: ScriptSourceFormatEnum;

  @Column()
  content: string;
  
  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;
}
