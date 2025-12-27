import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Role } from "../../app.roles";

export class UserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty({ enum: Role })
  @Expose()
  role: Role;
}