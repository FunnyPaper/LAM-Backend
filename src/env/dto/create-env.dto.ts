import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Length } from "class-validator";

export class CreateEnvDto {
  @ApiProperty()
  @Length(1, 32)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Length(1, 1024)
  description?: string;

  @ApiProperty({ type: Object, required: false})
  @IsOptional()
  data?: Record<string, any>;
}
