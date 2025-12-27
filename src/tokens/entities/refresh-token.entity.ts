import { Type } from "class-transformer";
import columnDateOptions from "../../shared/decorators/column-date-options";
import { UserEntity } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

const dateOptions = columnDateOptions(process.env.DB_TYPE!);

@Entity({ name: 'refresh-token' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenHash: string;

  @OneToOne(() => UserEntity, user => user.refreshToken, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column(dateOptions)
  @Type(() => Date)
  expiresAt: Date;

  @CreateDateColumn(dateOptions)
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn(dateOptions)
  @Type(() => Date)
  updatedAt: Date;
}