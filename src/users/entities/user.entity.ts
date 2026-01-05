import { Role } from "../../app.roles";
import { RefreshTokenEntity } from "../../tokens/entities/refresh-token.entity";
import columnDateOptions from "../../shared/decorators/column-date-options";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Type } from "class-transformer";
import { ScriptEntity } from "src/scripts/entities/script.entity";
import { EnvEntity } from "../../env/entities/env.entity";
import { columnEnumType } from "src/shared/decorators/column-enum-type";
import { ScriptRunEntity } from "src/scripts/entities/script-run.entity";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);
const enumType = columnEnumType(process.env.DB_TYPE!);

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ 
    type: enumType, 
    enum: Role, 
    default: Role.USER 
  })
  role: Role;

  @OneToOne(() => RefreshTokenEntity, (token) => token.user)
  @JoinColumn()
  refreshToken: RefreshTokenEntity | null;

  @OneToMany(() => ScriptEntity, (script) => script.owner)
  scripts: ScriptEntity[];

  @OneToMany(() => EnvEntity, (env) => env.owner, {
    cascade: true
  })
  envs: EnvEntity[];

  @OneToMany(() => ScriptRunEntity, (scriptRun) => scriptRun.createdBy)
  scriptRuns: ScriptRunEntity[]

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;
}
