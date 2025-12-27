import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../app.roles";
import { IsEnum, IsStrongPassword, Length, Matches, MaxLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @Matches(/^[a-zA-Z0-9._-]+$/)
  @Length(6, 32)
  username: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
  @MaxLength(128)
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}