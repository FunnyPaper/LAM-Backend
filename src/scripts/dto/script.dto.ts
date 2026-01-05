import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ScriptDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
  
  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  createdAt: Date;
  
  @ApiProperty()
  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}