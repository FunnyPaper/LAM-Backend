import { ScriptSourceFormatEnum } from "../enums/script-source-format.enum";
import { Expose } from "class-transformer";

export class ScriptSourceSnapshotDto {
  @Expose()
  content: string;
  
  @Expose()
  format: ScriptSourceFormatEnum;
  
  @Expose()
  createdAt: Date;
  
  @Expose()
  updatedAt: Date;
}