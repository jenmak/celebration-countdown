import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginDTO {
  /** Email address, or Cognito username for email-alias pools. */
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @MinLength(8)
  password: string
}
