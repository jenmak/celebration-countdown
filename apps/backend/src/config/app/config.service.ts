import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get('app.nodeEnv')
  }

  get port(): number {
    return this.configService.get('app.port')
  }
}
