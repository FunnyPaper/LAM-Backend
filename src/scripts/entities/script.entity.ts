import { Type } from "class-transformer";
import columnDateOptions from "src/shared/decorators/column-date-options";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ScriptVersionEntity } from "./script-version.entity";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);

@Entity({ name: 'script' })
export class ScriptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.scripts)
  owner: UserEntity;

  @OneToMany(() => ScriptVersionEntity, (version) => version.script)
  versions: ScriptVersionEntity[];

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;
}
