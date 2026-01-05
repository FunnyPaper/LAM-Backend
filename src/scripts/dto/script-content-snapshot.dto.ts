import { Expose } from "class-transformer";

export class ScriptContentSnapshotDto {
  @Expose()
  astJson: Record<string, any> | null;
  
  @Expose()
  astVersion: number;

  @Expose()
  engineVersion: number;
  
  @Expose()
  createdAt: Date;
  
  @Expose()
  updatedAt: Date;
}