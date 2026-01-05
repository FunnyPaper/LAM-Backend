import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsUUID } from "class-validator";

export class CreateScriptRunDto {
  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsUUID()
  envId?: string

  @ApiProperty()
  @Expose()
  @IsUUID()
  scriptVersionId: string
}