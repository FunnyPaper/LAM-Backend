import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";
import { ScriptRunResultDto } from "./script-run-result.dto";
import { Expose, Type } from "class-transformer";
import { ScriptVersionSnapshotDto } from "./script-versions-snapshot.dto";
import { EnvSnapshotDto } from "./env-snapshot.dto";

export class ScriptRunDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ enum: ScriptRunStatusEnum })
  @Expose()
  status: ScriptRunStatusEnum;

  @ApiProperty({ type: ScriptVersionSnapshotDto })
  @Expose()
  @Type(() => ScriptVersionSnapshotDto)
  scriptVersionSnapshot: ScriptVersionSnapshotDto;
  
  @ApiPropertyOptional({ type: EnvSnapshotDto })
  @Expose()
  @Type(() => EnvSnapshotDto)
  envSnapshot?: EnvSnapshotDto;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => ScriptRunResultDto)
  result?: ScriptRunResultDto;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  createdAt: Date;
  
  @ApiProperty()
  @Expose()
  @Type(() => Date)
  updatedAt: Date;
  
  @ApiProperty()
  @Expose()
  @Type(() => Date)
  finishedAt: Date;
}