import { ApiProperty } from "@nestjs/swagger";
import { UpdateScriptContentDto } from "./update-script-content.dto";
import { UpdateScriptSourceDto } from "./update-script-source.dto";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class UpdateScriptVersionDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => UpdateScriptContentDto)
  content?: UpdateScriptContentDto;

  @ApiProperty()
  @IsOptional()
  @Type(() => UpdateScriptSourceDto)
  source?: UpdateScriptSourceDto;
}