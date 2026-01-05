import { ScriptContentSnapshotDto } from "./script-content-snapshot.dto";
import { ScriptSourceSnapshotDto } from "./script-source-snapshot.dto";
import { ScriptVersionStatusEnum } from "../enums/script-version-status.enum";
import { Expose, Type } from "class-transformer";

export class ScriptVersionSnapshotDto {
  @Expose()
  status: ScriptVersionStatusEnum;
  
  @Expose()
  versionNumber: number;
  
  @Expose()
  createdAt: Date;
  
  @Expose()
  @Type(() => ScriptContentSnapshotDto)
  content: ScriptContentSnapshotDto;
  
  @Expose()
  @Type(() => ScriptSourceSnapshotDto)
  source: ScriptSourceSnapshotDto;
}