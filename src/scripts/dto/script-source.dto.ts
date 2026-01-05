import { ApiProperty } from "@nestjs/swagger";
import { ScriptSourceFormatEnum } from "../enums/script-source-format.enum";
import { Expose, Type } from "class-transformer";

export class ScriptSourceDto {
  @ApiProperty({ enum: ScriptSourceFormatEnum })
  @Expose()
  format: ScriptSourceFormatEnum;
  
  @ApiProperty()
  @Expose()
  content: string;
  
  @ApiProperty()
  @Expose()
  @Type(() => Date) 
  createdAt: Date;
  
  @ApiProperty()
  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}