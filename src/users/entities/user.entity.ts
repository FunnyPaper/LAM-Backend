import { Role } from "../../app.roles";
import { RefreshTokenEntity } from "../../tokens/entities/refresh-token.entity";
import columnDateOptions from "../../shared/decorators/column-date-options";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Type } from "class-transformer";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ 
    type: process.env.DB_TYPE === 'postgres' ? 'enum' : 'text', 
    enum: process.env.DB_TYPE === 'postgres' ? Role : undefined, 
    default: Role.USER 
  })
  role: Role;

  @OneToOne(() => RefreshTokenEntity, (token) => token.user)
  @JoinColumn()
  refreshToken: RefreshTokenEntity | null;

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;
}
