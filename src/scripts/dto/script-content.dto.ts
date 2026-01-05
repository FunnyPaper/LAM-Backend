import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ScriptContentDto {
  @ApiPropertyOptional()
  @Expose()
  astJson?: Record<string, any>;

  @ApiProperty()
  @Expose()
  astVersion: number;
  
  @ApiProperty()
  @Expose()
  engineVersion: number;
  
  @ApiProperty()
  @Expose()
  @Type(() => Date)
  createdAt: Date;
  
  @ApiProperty()
  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}