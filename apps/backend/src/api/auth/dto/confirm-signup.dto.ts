import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ConfirmSignUpDTO {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  code: string
}
