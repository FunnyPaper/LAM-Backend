import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsEnum, IsIn, IsNumber, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { ScriptSourceFormatEnum } from "../enums/script-source-format.enum";
import { ScriptFilterDto } from "./query-script.dto";
import { PaginationDto } from "src/shared/dto/pagination.dto";

export class ScriptVersionSortDto {
  @ApiProperty()
  @Expose()
  @IsIn([
    'versionNumber', 
    'status', 
    'createdAt', 
    'sourceFormat', 
    'sourceCreatedAt', 
    'sourceUpdatedAt', 
    'contentEngineVersion',
    'contentAstVersion'
  ])
  sortBy: string;
  
  @ApiProperty()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';
}

export class ScriptSourceFilterDto {
  @ApiPropertyOptional({ enum: ScriptSourceFormatEnum })
  @Expose()
  @IsOptional()
  @IsEnum(ScriptSourceFormatEnum)
  format?: ScriptSourceFormatEnum;
}

export class ScriptContentFilterDto {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsNumber()
  engineVersion?: number;
}

export class ScriptVersionFilterDto {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @Type(() => ScriptSourceFilterDto)
  source?: ScriptSourceFilterDto

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @Type(() => ScriptContentFilterDto)
  content?: ScriptContentFilterDto

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsUUID()
  runId?: string
}

export class QueryScriptVersionDto {
  @ApiPropertyOptional({ type: () => ScriptVersionSortDto })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ScriptVersionSortDto)
  sorting?: ScriptVersionSortDto

  @ApiPropertyOptional({ type: () => ScriptVersionFilterDto })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ScriptVersionFilterDto)
  filtering?: ScriptVersionFilterDto

  @ApiPropertyOptional({ type: () => ScriptFilterDto })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto
}