import { Type } from "class-transformer";
import columnDateOptions from "src/shared/decorators/column-date-options";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ScriptVersionEntity } from "./script-version.entity";
import { columnJsonType } from "src/shared/decorators/column-json-type";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);
const jsonType = columnJsonType(process.env.DB_TYPE!);

@Entity({ name: 'script-content' })
export class ScriptContentEntity {
  @PrimaryColumn('uuid')
  scriptVersionId: string;

  @OneToOne(() => ScriptVersionEntity, (version) => version.content, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'scriptVersionId' })
  scriptVersion: ScriptVersionEntity;

  @Column({ type: jsonType, nullable: true })
  astJson: Record<string, any> | null;

  @Column()
  astVersion: number;

  @Column()
  engineVersion: number;

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;
}
