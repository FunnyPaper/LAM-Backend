import columnDateOptions from "../../shared/decorators/column-date-options";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Type } from "class-transformer";
import { UserEntity } from "../../users/entities/user.entity";
import { columnJsonType } from "src/shared/decorators/column-json-type";
import { ScriptRunEntity } from "src/scripts/entities/script-run.entity";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);
const jsonType = columnJsonType(process.env.DB_TYPE!);

@Entity({ name: 'env' })
export class EnvEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (owner) => owner.envs, {
    onDelete: 'CASCADE'
  })
  owner: UserEntity;

  @OneToMany(() => ScriptRunEntity, (run) => run.env)
  runs: ScriptRunEntity[];

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: jsonType, nullable: true })
  data: Record<string, any> | null;

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;
}
