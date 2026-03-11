import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsNumber, IsObject, Min } from "class-validator"

export class CreateScriptContentDto {
  @ApiProperty()
  @Expose()
  @IsObject()
  @Type(() => Object)
  astJson: Record<string, any>

  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @Min(1)
  astVersion: number

  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @Min(1)
  engineVersion: number
}