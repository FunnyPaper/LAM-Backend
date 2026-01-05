import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ScriptRunResultDto {
  @ApiPropertyOptional()
  @Expose()
  data?: Record<string, any>

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}