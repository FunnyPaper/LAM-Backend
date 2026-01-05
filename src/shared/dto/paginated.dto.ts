import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"

export class PaginatedMetadataDto {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  limit: number

  @ApiProperty()
  @Expose()
  totalItems: number

  @ApiProperty()
  @Expose()
  totalPages: number
}

export function PaginatedDto<T extends new() => any>(cls: T) {
  class PaginatedDto {
    @ApiProperty({ type: cls })
    @Expose()
    @Type(() => cls)
    data: InstanceType<T>[]

    @ApiProperty()
    @Expose()
    @Type(() => PaginatedMetadataDto)
    metadata: PaginatedMetadataDto
  }

  return PaginatedDto;
}