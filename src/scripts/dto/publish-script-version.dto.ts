import { ApiPropertyOptional } from "@nestjs/swagger";
import { Length } from "class-validator";

export class PublishScriptVersionDto {
  @ApiPropertyOptional()
  @Length(1, 32)
  name?: string;
}