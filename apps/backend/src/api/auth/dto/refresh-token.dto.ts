import { IsString, MinLength } from 'class-validator'

export class RefreshTokenDTO {
  @IsString()
  @MinLength(10)
  refreshToken: string
}
