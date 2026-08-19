import { createHash } from 'node:crypto'
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { AWSConfigService } from '@config/aws/config.service'
import { CognitoConfigService } from '@config/cognito/config.service'
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import {
  ConfirmForgotPasswordDTO,
  ForgotPasswordDTO,
} from './dto/reset-password.dto'
import { ConfirmSignUpDTO } from './dto/confirm-signup.dto'
import { LoginDTO } from './dto/login.dto'
import { RefreshTokenDTO } from './dto/refresh-token.dto'
import { SignupDTO } from './dto/signup.dto'
import { serializeUser } from './serializers/user.serializer'

/**
 * Cognito pools configured with email as an *alias* reject email-formatted usernames.
 * Use a stable non-email username; login can still use the email alias.
 */
function cognitoUsernameFromEmail(email: string): string {
  const hash = createHash('sha256')
    .update(email.trim().toLowerCase())
    .digest('hex')
    .slice(0, 32)
  return `u_${hash}`
}

@Injectable()
export class AuthService {
  private readonly cognitoClient: CognitoIdentityProviderClient

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(AWSConfigService)
    private readonly awsConfig: AWSConfigService,
    @Inject(CognitoConfigService)
    private readonly cognitoConfig: CognitoConfigService,
  ) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.accessKey,
        secretAccessKey: this.awsConfig.secret,
      },
    })
  }

  async signup(body: SignupDTO) {
    const email = body.email.trim().toLowerCase()
    const firstName = body.firstName.trim()
    const lastName = body.lastName.trim()
    const username = cognitoUsernameFromEmail(email)

    try {
      const result = await this.cognitoClient.send(
        new SignUpCommand({
          ClientId: this.cognitoConfig.clientId,
          Username: username,
          Password: body.password,
          UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'given_name', Value: firstName },
            { Name: 'family_name', Value: lastName },
          ],
        }),
      )

      if (result.UserSub) {
        await this.prisma.user.upsert({
          where: { cognitoSub: result.UserSub },
          create: {
            cognitoSub: result.UserSub,
            email,
            firstName,
            lastName,
          },
          update: {
            email,
            firstName,
            lastName,
          },
        })
      }

      return {
        userConfirmed: Boolean(result.UserConfirmed),
        codeDelivery:
          result.CodeDeliveryDetails?.DeliveryMedium ??
          result.CodeDeliveryDetails?.Destination ??
          null,
        message: result.UserConfirmed
          ? 'Account created'
          : 'Confirm your account with the code sent to your email',
      }
    } catch (error) {
      throw new BadRequestException(this.cognitoErrorMessage(error))
    }
  }

  async confirmSignUp(body: ConfirmSignUpDTO) {
    const email = body.email.trim().toLowerCase()
    try {
      await this.cognitoClient.send(
        new ConfirmSignUpCommand({
          ClientId: this.cognitoConfig.clientId,
          Username: cognitoUsernameFromEmail(email),
          ConfirmationCode: body.code.trim(),
        }),
      )
      return { success: true }
    } catch (error) {
      throw new BadRequestException(this.cognitoErrorMessage(error))
    }
  }

  async resendConfirmationCode(body: ForgotPasswordDTO) {
    const email = body.email.trim().toLowerCase()
    try {
      const result = await this.cognitoClient.send(
        new ResendConfirmationCodeCommand({
          ClientId: this.cognitoConfig.clientId,
          Username: cognitoUsernameFromEmail(email),
        }),
      )
      return {
        message: 'Confirmation code resent',
        codeDelivery:
          result.CodeDeliveryDetails?.DeliveryMedium ??
          result.CodeDeliveryDetails?.Destination ??
          null,
      }
    } catch (error) {
      throw new BadRequestException(this.cognitoErrorMessage(error))
    }
  }

  async login(body: LoginDTO) {
    const identifier = body.email.trim()
    // Pools with email-as-alias can't always sign in by email until verified;
    // our signup always uses a derived username, so map emails to that.
    const username = identifier.includes('@')
      ? cognitoUsernameFromEmail(identifier.toLowerCase())
      : identifier

    try {
      const result = await this.cognitoClient.send(
        new InitiateAuthCommand({
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          ClientId: this.cognitoConfig.clientId,
          AuthParameters: {
            USERNAME: username,
            PASSWORD: body.password,
          },
        }),
      )

      if (!result.AuthenticationResult?.AccessToken) {
        throw new UnauthorizedException('Unable to authenticate with Cognito')
      }

      const user = await this.syncUserFromAccessToken(
        result.AuthenticationResult.AccessToken,
      )

      return {
        accessToken: result.AuthenticationResult.AccessToken,
        refreshToken: result.AuthenticationResult.RefreshToken,
        idToken: result.AuthenticationResult.IdToken,
        expiresIn: result.AuthenticationResult.ExpiresIn,
        tokenType: result.AuthenticationResult.TokenType ?? 'Bearer',
        user: serializeUser(user),
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }
      throw new UnauthorizedException(this.cognitoErrorMessage(error))
    }
  }

  async refresh(body: RefreshTokenDTO) {
    try {
      const result = await this.cognitoClient.send(
        new InitiateAuthCommand({
          AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
          ClientId: this.cognitoConfig.clientId,
          AuthParameters: {
            REFRESH_TOKEN: body.refreshToken,
          },
        }),
      )

      if (!result.AuthenticationResult?.AccessToken) {
        throw new UnauthorizedException('Unable to refresh Cognito session')
      }

      const user = await this.syncUserFromAccessToken(
        result.AuthenticationResult.AccessToken,
      )

      return {
        accessToken: result.AuthenticationResult.AccessToken,
        idToken: result.AuthenticationResult.IdToken,
        expiresIn: result.AuthenticationResult.ExpiresIn,
        tokenType: result.AuthenticationResult.TokenType ?? 'Bearer',
        refreshToken: body.refreshToken,
        user: serializeUser(user),
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }
      throw new UnauthorizedException(this.cognitoErrorMessage(error))
    }
  }

  async logout(accessToken: string) {
    try {
      await this.cognitoClient.send(
        new GlobalSignOutCommand({
          AccessToken: accessToken,
        }),
      )
      return { success: true }
    } catch (error) {
      throw new BadRequestException(this.cognitoErrorMessage(error))
    }
  }

  async forgotPassword(body: ForgotPasswordDTO) {
    const email = body.email.trim().toLowerCase()
    try {
      await this.cognitoClient.send(
        new ForgotPasswordCommand({
          ClientId: this.cognitoConfig.clientId,
          Username: cognitoUsernameFromEmail(email),
        }),
      )
      return {
        message: 'If an account exists, a reset code has been sent',
      }
    } catch (error) {
      throw new BadRequestException(this.cognitoErrorMessage(error))
    }
  }

  async confirmForgotPassword(body: ConfirmForgotPasswordDTO) {
    const email = body.email.trim().toLowerCase()
    try {
      await this.cognitoClient.send(
        new ConfirmForgotPasswordCommand({
          ClientId: this.cognitoConfig.clientId,
          Username: cognitoUsernameFromEmail(email),
          ConfirmationCode: body.code.trim(),
          Password: body.newPassword,
        }),
      )
      return { success: true }
    } catch (error) {
      throw new BadRequestException(this.cognitoErrorMessage(error))
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    return serializeUser(user)
  }

  async findOrCreateFromCognito(claims: {
    sub: string
    email?: string
    given_name?: string
    family_name?: string
    username?: string
  }) {
    if (!claims.sub) {
      throw new UnauthorizedException('Cognito token is missing subject')
    }

    const existing = await this.prisma.user.findUnique({
      where: { cognitoSub: claims.sub },
    })
    if (existing) {
      return this.prisma.user.update({
        where: { id: existing.id },
        data: {
          ...(claims.email
            ? { email: claims.email.trim().toLowerCase() }
            : {}),
          ...(claims.given_name
            ? { firstName: claims.given_name.trim() }
            : {}),
          ...(claims.family_name
            ? { lastName: claims.family_name.trim() }
            : {}),
        },
      })
    }

    const email = (claims.email || claims.username || '').trim().toLowerCase()
    if (!email) {
      throw new UnauthorizedException(
        'Cognito token is missing email; sign in once via /auth/login first',
      )
    }

    return this.prisma.user.create({
      data: {
        cognitoSub: claims.sub,
        email,
        firstName: claims.given_name?.trim() || email.split('@')[0],
        lastName: claims.family_name?.trim() || '',
      },
    })
  }

  private async syncUserFromAccessToken(accessToken: string) {
    const cognitoUser = await this.cognitoClient.send(
      new GetUserCommand({ AccessToken: accessToken }),
    )

    const attrs = Object.fromEntries(
      (cognitoUser.UserAttributes ?? []).map((attr) => [
        attr.Name ?? '',
        attr.Value ?? '',
      ]),
    )

    const sub = attrs.sub
    const email = (attrs.email || cognitoUser.Username || '').toLowerCase()
    if (!sub || !email) {
      throw new UnauthorizedException('Unable to resolve Cognito user')
    }

    return this.findOrCreateFromCognito({
      sub,
      email,
      given_name: attrs.given_name,
      family_name: attrs.family_name,
    })
  }

  private cognitoErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: string }).message)
    }
    return 'Cognito request failed'
  }
}
