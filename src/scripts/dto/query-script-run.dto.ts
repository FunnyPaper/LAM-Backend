import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDate, IsEnum, IsIn, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";
import { ScriptFilterDto } from "./query-script.dto";
import { PaginationDto } from "src/shared/dto/pagination.dto";

export class ScriptRunSortDto {
  @ApiProperty()
  @Expose()
  @IsIn(['status', 'createdAt', 'updatedAt', 'finishedAt'])
  sortBy: string;
  
  @ApiProperty()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';
}

export class ScriptRunFilterDto {
  @ApiPropertyOptional({ enum: ScriptRunStatusEnum })
  @Expose()
  @IsOptional()
  @IsEnum(ScriptRunStatusEnum)
  status?: ScriptRunStatusEnum;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsUUID()
  scriptId?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsUUID()
  scriptVersionId?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
  
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finishedAt?: Date;
}

export class QueryScriptRunDto {
  @ApiPropertyOptional({ type: () => ScriptRunSortDto })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ScriptRunSortDto)
  sorting?: ScriptRunSortDto

  @ApiPropertyOptional({ type: () => ScriptRunFilterDto })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ScriptRunFilterDto)
  filtering?: ScriptRunFilterDto

  @ApiPropertyOptional({ type: () => ScriptFilterDto })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto
}