import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Length } from "class-validator";

export class CreateScriptDto {
  @ApiProperty()
  @Length(1, 32)
  name: string;

  @ApiProperty()
  @IsOptional()
  @Length(1, 1024)
  description?: string;
}
