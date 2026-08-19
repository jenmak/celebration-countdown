import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class S3ConfigService {
  constructor(private configService: ConfigService) {}

  get bucket(): string {
    return this.configService.get('s3.bucket')
  }
}
