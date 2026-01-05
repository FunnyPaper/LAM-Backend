import { Expose } from "class-transformer";

export class EnvSnapshotDto {
  @Expose()
  name: string;

  @Expose()
  description: string | null;
  
  @Expose()
  data: Record<string, any> | null;
}