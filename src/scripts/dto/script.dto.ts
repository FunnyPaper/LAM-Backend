import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ScriptVersionDto } from "./script-version.dto";

export class ScriptDto {
    @ApiProperty()
    @Expose()
    id!: string;

    @ApiProperty()
    @Expose()
    name!: string;

    @ApiPropertyOptional()
    @Expose()
    description?: string;

    @ApiProperty()
    @Expose()
    @Type(() => Date)
    createdAt!: Date;

    @ApiProperty()
    @Expose()
    @Type(() => Date)
    updatedAt!: Date;

    @ApiProperty()
    @Expose()
    @Type(() => ScriptVersionDto)
    versions?: ScriptVersionDto[]
}