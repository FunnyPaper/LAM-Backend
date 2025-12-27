import { JwtService } from "@nestjs/jwt";

export function createJwtServiceMock() {
  return {
    sign: jest.fn().mockImplementation().mockReturnValue('hash'),
    signAsync: jest.fn().mockImplementation().mockReturnValue('token')
  } satisfies Pick<JwtService, 'sign' | 'signAsync'>
}