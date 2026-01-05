import { Type } from "class-transformer"
import { CreateScriptContentDto } from "./create-script-content.dto"
import { CreateScriptSourceDto } from "./create-script-source.dto"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested } from "class-validator"

export class CreateScriptVersionDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateScriptContentDto)
  content: CreateScriptContentDto

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateScriptSourceDto)
  source: CreateScriptSourceDto
}