import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class EnvDto {
  @ApiProperty()
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @ApiProperty({ type: Object, nullable: true })
  @Expose()
  data?: Record<string, any>;
}