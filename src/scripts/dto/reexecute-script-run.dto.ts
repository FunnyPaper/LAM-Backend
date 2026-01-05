import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsUUID } from "class-validator";

export class ReexecuteScriptRunDto {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsUUID()
  envId?: string
}