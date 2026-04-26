import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ScriptVersionStatusEnum } from "../enums/script-version-status.enum";
import { Expose, Type } from "class-transformer";
import { ScriptContentDto } from "./script-content.dto";
import { ScriptSourceDto } from "./script-source.dto";
import { ScriptRunDto } from "./script-run.dto";

export class ScriptVersionDto {
    @ApiProperty()
    @Expose()
    id!: string;

    @ApiPropertyOptional({ nullable: true })
    @Expose()
    name!: string | null;

    @ApiProperty()
    @Expose()
    @Type(() => ScriptContentDto)
    content!: ScriptContentDto;

    @ApiProperty()
    @Expose()
    @Type(() => ScriptSourceDto)
    source!: ScriptSourceDto;

    @ApiPropertyOptional()
    @Expose()
    @Type(() => ScriptRunDto)
    runs?: ScriptRunDto[];

    @ApiProperty()
    @Expose()
    versionNumber!: number;

    @ApiProperty({ enum: ScriptVersionStatusEnum })
    @Expose()
    status!: ScriptVersionStatusEnum;

    @ApiProperty()
    @Expose()
    @Type(() => Date)
    createdAt!: Date;

    @ApiProperty()
    @Expose()
    @Type(() => Date)
    updatedAt!: Date;
}