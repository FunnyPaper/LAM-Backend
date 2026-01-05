import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class PaginationDto {
  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @Min(1)
  page: number;
  
  @ApiProperty({ default: 10 })
  @Expose()
  @IsNumber()
  @Min(1)
  limit: number;
}