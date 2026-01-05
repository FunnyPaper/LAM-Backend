import { ApiProperty } from "@nestjs/swagger";
import { ScriptVersionStatusEnum } from "../enums/script-version-status.enum";
import { Expose, Type } from "class-transformer";
import { ScriptContentDto } from "./script-content.dto";
import { ScriptSourceDto } from "./script-source.dto";

export class ScriptVersionDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  @Type(() => ScriptContentDto)
  content: ScriptContentDto;

  @ApiProperty()
  @Expose()
  @Type(() => ScriptSourceDto) 
  source: ScriptSourceDto;

  @ApiProperty()
  @Expose()
  versionNumber: number;

  @ApiProperty({ enum: ScriptVersionStatusEnum })
  @Expose()
  status: ScriptVersionStatusEnum;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  createdAt: Date;
}