import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '../auth.service'

type CognitoJwtPayload = {
  sub?: string
  email?: string
  given_name?: string
  family_name?: string
  username?: string
  'cognito:username'?: string
}

/**
 * Maps a verified Cognito token to the local user row on request.user.
 * Use after AuthenticationGuard: @UseGuards(AuthenticationGuard, LocalUserGuard)
 */
@Injectable()
export class LocalUserGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const payload = request.cognito_jwt_payload as CognitoJwtPayload | undefined

    const sub = payload?.sub
    if (!sub) {
      throw new UnauthorizedException('Missing Cognito subject')
    }

    const username = payload.username || payload['cognito:username']
    const user = await this.authService.findOrCreateFromCognito({
      sub,
      email: payload.email,
      given_name: payload.given_name,
      family_name: payload.family_name,
      username,
    })

    request.user = {
      id: user.id,
      username: user.email,
      cognitoSub: user.cognitoSub,
    }

    return true
  }
}
