import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AnthropicConfigService {
  constructor(private configService: ConfigService) {}

  get apiKey(): string {
    return this.configService.get<string>('anthropic.apiKey') ?? ''
  }

  get model(): string {
    return (
      this.configService.get<string>('anthropic.model') ??
      'claude-haiku-4-5-20251001'
    )
  }
}
