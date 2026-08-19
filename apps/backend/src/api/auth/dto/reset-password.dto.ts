import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ForgotPasswordDTO {
  @IsEmail()
  email: string
}

export class ConfirmForgotPasswordDTO {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @MinLength(8)
  newPassword: string
}
