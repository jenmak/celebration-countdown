import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthUser, CurrentUser } from '@common/decorators/current-user.decorator'
import { AuthService } from './auth.service'
import { ConfirmSignUpDTO } from './dto/confirm-signup.dto'
import { LoginDTO } from './dto/login.dto'
import { RefreshTokenDTO } from './dto/refresh-token.dto'
import {
  ConfirmForgotPasswordDTO,
  ForgotPasswordDTO,
} from './dto/reset-password.dto'
import { SignupDTO } from './dto/signup.dto'
import { AuthenticationGuard } from '@nestjs-cognito/auth'
import { LocalUserGuard } from './guards/cognito-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() body: SignupDTO) {
    return this.authService.signup(body)
  }

  @Post('confirm-signup')
  @HttpCode(HttpStatus.OK)
  confirmSignUp(@Body() body: ConfirmSignUpDTO) {
    return this.authService.confirmSignUp(body)
  }

  @Post('resend-confirmation')
  @HttpCode(HttpStatus.OK)
  resendConfirmation(@Body() body: ForgotPasswordDTO) {
    return this.authService.resendConfirmationCode(body)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDTO) {
    return this.authService.login(body)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: RefreshTokenDTO) {
    return this.authService.refresh(body)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Headers('authorization') authorization?: string) {
    const accessToken = authorization?.replace(/^Bearer\s+/i, '').trim()
    if (!accessToken) {
      return { success: true }
    }
    return this.authService.logout(accessToken)
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() body: ForgotPasswordDTO) {
    return this.authService.forgotPassword(body)
  }

  @Post('confirm-forgot-password')
  @HttpCode(HttpStatus.OK)
  confirmForgotPassword(@Body() body: ConfirmForgotPasswordDTO) {
    return this.authService.confirmForgotPassword(body)
  }

  @Get('me')
  @UseGuards(AuthenticationGuard, LocalUserGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.id)
  }
}
