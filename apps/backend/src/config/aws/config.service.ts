import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AWSConfigService {
  constructor(private configService: ConfigService) {}

  get region(): string {
    return this.configService.get('aws.region')
  }

  get accessKey(): string {
    return this.configService.get('aws.accessKey')
  }

  get secret(): string {
    return this.configService.get('aws.secret')
  }
}
