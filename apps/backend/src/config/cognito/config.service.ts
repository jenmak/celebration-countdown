import { AWSConfigService } from '@config/aws/config.service'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CognitoConfigService {
  constructor(
    @Inject(AWSConfigService)
    private readonly awsConfig: AWSConfigService,
    private readonly configService: ConfigService,
  ) {}

  get userPoolId(): string {
    return this.configService.get('cognito.userPoolId')
  }

  get clientId(): string {
    return this.configService.get('cognito.clientId')
  }

  get authority(): string {
    return `https://cognito-idp.${this.awsConfig.region}.amazonaws.com/${this.userPoolId}`
  }
}
