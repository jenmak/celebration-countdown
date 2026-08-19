import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SignupDTO {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  firstName: string

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  lastName: string

  @IsString()
  @MinLength(8)
  password: string
}
