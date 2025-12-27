import { ApiProperty } from "@nestjs/swagger";
import { IsStrongPassword, Length, Matches, MaxLength } from "class-validator";

export class LoginDto {
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
}