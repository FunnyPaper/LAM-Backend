import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsNumber, Min } from "class-validator"

export class CreateScriptContentDto {
  @ApiProperty()
  @Expose()
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