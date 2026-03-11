import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsIn, IsOptional, Length, ValidateNested } from "class-validator";
import { PaginationDto } from "src/shared/dto/pagination.dto";

export class EnvSortDto {
  @ApiProperty()
  @Expose()
  @IsIn(['name', 'createdAt', 'updatedAt'])
  sortBy: string;

  @ApiProperty()
  @Expose()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'ASC';
}

export class EnvFilterDto {
  @ApiProperty()
  @Expose()
  @IsOptional()
  @Length(1, 32)
  name?: string;
}

export class QueryEnvDto {
  @ApiPropertyOptional({ type: () => EnvSortDto })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => EnvSortDto)
  sorting?: EnvSortDto;

  @ApiPropertyOptional({ type: () => EnvFilterDto })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => EnvFilterDto)
  filtering?: EnvFilterDto

  @ApiPropertyOptional({ type: () => PaginationDto })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto
}