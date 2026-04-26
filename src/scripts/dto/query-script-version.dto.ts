import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsNumber, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { ScriptSourceFormatEnum } from "../enums/script-source-format.enum";
import { ScriptFilterDto } from "./query-script.dto";
import { PaginationDto } from "src/shared/dto/pagination.dto";
import { ScriptVersionStatusEnum } from "../enums/script-version-status.enum";

export class ScriptVersionSortDto {
    @ApiProperty()
    @Expose()
    @IsIn([
        'versionNumber',
        'status',
        'createdAt',
        'updatedAt',
        'sourceFormat',
        'sourceCreatedAt',
        'sourceUpdatedAt',
        'contentEngineVersion',
        'contentAstVersion'
    ])
    sortBy!: string;

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
    @ValidateNested()
    @Type(() => ScriptSourceFilterDto)
    source?: ScriptSourceFilterDto

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => ScriptContentFilterDto)
    content?: ScriptContentFilterDto

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsEnum(ScriptVersionStatusEnum)
    status?: ScriptVersionStatusEnum;

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

    @ApiPropertyOptional({ isArray: true })
    @Expose()
    @IsOptional()
    @IsArray()
    @IsIn(['runs'], { each: true })
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        return value ? [value] : [];
    })
    include?: string[];
}