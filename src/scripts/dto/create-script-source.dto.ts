import { ApiProperty } from "@nestjs/swagger"
import { ScriptSourceFormatEnum } from "../enums/script-source-format.enum"
import { Expose } from "class-transformer"
import { IsEnum, IsString } from "class-validator"

export class CreateScriptSourceDto {
  @ApiProperty({ enum: ScriptSourceFormatEnum })
  @Expose()
  @IsEnum(ScriptSourceFormatEnum)
  format: ScriptSourceFormatEnum

  @ApiProperty()
  @Expose()
  @IsString()
  content: string
}