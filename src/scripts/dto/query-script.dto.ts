import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsArray, IsIn, IsOptional, IsUUID, Length, ValidateNested } from "class-validator";
import { PaginationDto } from "src/shared/dto/pagination.dto";

export class ScriptSortDto {
    @ApiProperty()
    @Expose()
    @IsIn(['name', 'createdAt', 'updatedAt'])
    sortBy!: string;

    @ApiProperty()
    @Expose()
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC' = 'ASC';
}

export class ScriptFilterDto {
    @ApiProperty()
    @Expose()
    @IsOptional()
    @Length(1, 32)
    name?: string;

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsUUID()
    scriptVersionId?: string;

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsUUID()
    runId?: string
}

export class QueryScriptDto {
    @ApiPropertyOptional({ type: () => ScriptSortDto })
    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => ScriptSortDto)
    sorting?: ScriptSortDto;

    @ApiPropertyOptional({ type: () => ScriptFilterDto })
    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => ScriptFilterDto)
    filtering?: ScriptFilterDto

    @ApiPropertyOptional({ type: () => PaginationDto })
    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination?: PaginationDto

    @ApiPropertyOptional({ isArray: true })
    @Expose()
    @IsOptional()
    @IsArray()
    @IsIn(['versions', 'runs'], { each: true })
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        return value ? [value] : [];
    })
    include?: string[];
}